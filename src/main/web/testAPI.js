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
			} else {
				res.json({});
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
		console.log('Error auth: Name = ' + name
		 + '; password = ' + pwd);
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

app.put('/resources/addUser', (req, res) => {
	var userOrigin = req.body;
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var user = users.filter(u => {
			return u.login === userOrigin.login;
		});
		logout();
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
			user = userOrigin;
			user.id = users.length + 1;
			user.active = true;
			user.attempts = 0;
			user.maxAttempts = 5;
			user.lastmodified = new Date().getTime();
			if(user.customFields){
				user.customFields.forEach((e) => {
					var val = e.value;
					val = isNaN(val) ? val : Number(val);
					if(typeof(val) === 'string'){
						if(val.toLowerCase() === 'true' ||
							val.toLowerCase() === 'false')
						val = Boolean(val.toLowerCase());
					}
					if(e.type === 'Timestamp'){
						val = new Date(val).getTime();
					}
					user[e.name] = val;
				});
				delete user.customFields;
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

app.delete('/saferesources/delUser', (req, res) => {
	var userOrigin = req.query;
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
				logout();
				res.json({result:'ok'});
			}
		} else {
			res.json({result:'bad'});
		}
	});
});

app.post('/saferesources/updateProfile', (req, res) => {
	var userOrigin = req.body;
	var newPassword = userOrigin.password1;
	delete userOrigin.password1;
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
				userOrigin.password = 
					newPassword && newPassword.length > 0 ?
						newPassword : userOrigin.password;
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

app.get('/resources/getUserFields', (req, res) => {
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		if(users.length > 0){
			var u = users[0];
			for(var k in u){
				var privateFields = ['login', 'email', 'password'];
				if(privateFields.indexOf(k.toLowerCase()) > -1){
					u[k] = null;
				} else {
					switch(typeof(u[k])){
						case 'string':
							if(u[k].match(/^[0-9,\-,:,\s]+$/)) {
								u[k] = timestamp2date(new Date().getTime());
							} else {
								u[k] = '';
							}
							break;
						case 'boolean': u[k] = true; break;
						case 'number':
							if((u[k] + '').indexOf('.') > -1){
								u[k] = 0.123456789;
							} else if (u[k] < 2147483647) {
								u[k] = 0;
							} else {
								u[k] = new Date().getTime();
							}
							break;
					}
				}
			}
			delete u.id;
			res.json(u);
		} else {
			res.send('');
		}
	});
});

app.get('/saferesources/profile', (req, res) => {
	fs.readFile('./api/resources/currentUser', (err, data) => {
		res.json(JSON.parse(data));
	});
});

logout = () => {
	fs.writeFile('./api/resources/authenticated',
				JSON.stringify({value: false}));
}
app.post('/logout', (req, res) => {
	logout();
	res.json('');
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