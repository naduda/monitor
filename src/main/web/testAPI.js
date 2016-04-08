var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', 8088);
app.use(require('connect-livereload')());

app.use('/', express.static(path.join(__dirname, './src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Cache-Control', 'no-cache');
		next();
});

app.get('/resources/user', (req, res) => {
	if(!req.headers.authorization) {
		fs.readFile('./api/resources/authenticated', (err, data) => {
			var authenticated = JSON.parse(data);
			if(authenticated.value){
				fs.readFile('./api/resources/headers', (err, data) => {
					authenticate(res, JSON.parse(data).value);
				});
			}
		});
	} else {
		authenticate(res, req.headers.authorization);
	}
});

authenticate = (res, authorization) => {
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var atob = require('atob');
		var obj = authorization, user, name, pwd;
		obj = obj.slice(obj.indexOf(' ') + 1);
		obj = atob(obj);
		obj = obj.split(':');
		name = obj[0];
		pwd = obj[1];

		user = users.filter(u => {return u.login === name;});
		user = user.length > 0 ? user[0] : null;
		if(user && (user.password === pwd)) {
			fs.writeFile('./api/resources/currentUser',
				JSON.stringify(user, null, 4));
			user.name = user.login;
			res.json(user);
			fs.writeFile('./api/resources/authenticated',
				JSON.stringify({value: true}));
			return;
		}
		console.log('Name = ' + name + '; password = ' + pwd);
		res.json({});
	});
}

app.get('/resources/langs', (req, res) => {
	fs.readFile('./api/resources/langs', (err, data) => {
		res.json(JSON.parse(data));
	});
});

app.get('/secureresources/profileInfo', (req, res) => {
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		fs.readFile('./api/resources/currentUser', (err, cu) => {
			var cu = JSON.parse(cu);
			var user = users.filter(u => {return u.id === cu.id;});
			user = user ? user[0] : null;
			if(user){
				res.json(user);
			}
		});
	});
});

app.post('/resources/addUser', (req, res) => {
	var userOrigin = req.body;
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var user = users.filter(u => {
			return u.login === userOrigin.login;
		});
		user = user ? user[0] : null;
		if(user){
			if(userOrigin.password !== user.password){
				res.json({result:'bad'});
				return;
			} else {
				user.email = userOrigin.email;
				user.active = true;
			}
		} else {
			user = {
				id: users.length + 1,
				login: userOrigin.login,
				email: userOrigin.email,
				password: userOrigin.password,
				active: true,
				attempts: 0,
				maxAttempts: 5,
				lastmodified: timestamp2date(new Date().getTime())
			}
			users.push(user);
		}
		fs.writeFile('./api/resources/currentUser',
				JSON.stringify(user, null, 4));
		fs.writeFile('./api/resources/user',
						JSON.stringify(users, null, 4));
		res.json({result:'ok'});
	});
});

app.post('/resources/recover', (req, res) => {
	var userOrigin = req.body;
	res.json({result:'ok'});
});

app.post('/saferesources/delUser', (req, res) => {
	var userOrigin = req.body;
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var user = users.filter(u => {
			return u.login === userOrigin.login;
		});
		user = user ? user[0] : null;
		if(user){
			if(userOrigin.password !== user.password){
				res.json({result:'bad'});
			} else {
				users.splice(users.indexOf(user), 1);
				fs.writeFile('./api/resources/user',
							JSON.stringify(users, null, 4));
				res.json({result:'ok'});
			}
		} else {
			res.json({result:'bad'});
		}
	});
});

app.post('/saferesources/updateProfile', (req, res) => {
	var userOrigin = req.body;
	fs.writeFile('./api/resources/currentUser',
				JSON.stringify(userOrigin, null, 4));
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var user = users.filter(u => {
			return u.id === userOrigin.id;
		});
		user = user ? user[0] : null;
		if(user){
			if(userOrigin.password !== user.password){
				res.json({result:'bad'});
			} else {
				userOrigin.password = userOrigin.password1.length > 0 ?
					userOrigin.password1 : userOrigin.password;
				delete userOrigin.password1;
				delete userOrigin.password2;
				users[users.indexOf(user)] = userOrigin;
				fs.writeFile('./api/resources/user',
						JSON.stringify(users, null, 4));
				res.json({result:'ok'});
			}
		} else {
			res.json({result:'bad'});
		}
	});
});

app.post('/logout', (req, res) => {
	fs.writeFile('./api/resources/authenticated',
				JSON.stringify({value: false}));
	res.json('');
});

app.get('/saferesources/profile', (req, res) => {
	fs.readFile('./api/resources/currentUser', (err, data) => {
		res.json(JSON.parse(data));
	});
});

app.post('/secureresources/test', (req, res) => {
	fs.readFile('./api/secureresources/test', (err, data) => {
		
		res.json(JSON.parse(data));
	});
});

app.get('/secureresources/plugins', (req, res) => {
	fs.readFile('./api/secureresources/plugins', (err, data) => {
		res.json(JSON.parse(data));
	});
});

app.listen(app.get('port'), () => {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});

timestamp2date = ts => {
	var a = new Date(ts);
	var year = a.getFullYear();
	var month = fullNumber(a.getMonth() + 1);
	var date = fullNumber(a.getDate());
	var hour = fullNumber(a.getHours());
	var min = fullNumber(a.getMinutes());
	var sec = fullNumber(a.getSeconds());
	var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

fullNumber = n => {return n < 10 ? '0' + n : n;}