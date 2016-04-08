console.log(app);
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
				JSON.stringify(user));
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

app.get('/resources/langs', function(req, res) {
	fs.readFile('./api/resources/langs', function(err, data) {
		res.json(JSON.parse(data));
	});
});

app.get('/secureresources/profileInfo', function(req, res) {
	fs.readFile('./api/resources/user', function(err, data) {
		var users = JSON.parse(data);
		fs.readFile('./api/resources/currentUser', function(err, cu) {
			var cu = JSON.parse(cu);
			var user = users.filter(u => {return u.login === cu.login;});
			user = user ? user[0] : null;
			var ct = new Date();
			if(user){
				res.json(user);
			}
		});
	});
});

app.post('/saferesources/updateProfile', (req, res) => {
	var userOrigin = req.body;
	fs.writeFile('./api/resources/currentUser',
				JSON.stringify(userOrigin));
	fs.readFile('./api/resources/user', (err, data) => {
		var users = JSON.parse(data);
		var user = users.filter(u => {
			return u.id === userOrigin.id;
		});
		user = user ? user[0] : null;
		var ct = new Date();
		if(user){
			users[users.indexOf(user)] = userOrigin;
			fs.writeFile('./api/resources/user',
					JSON.stringify(users, null, 4));
		}
	});
});

app.post('/logout', (req, res) => {
	fs.writeFile('./api/resources/authenticated',
				JSON.stringify({value: false}));
	res.json('');
});

app.get('/saferesources/profile', function(req, res) {
	fs.readFile('./api/resources/currentUser', function(err, data) {
		res.json(JSON.parse(data));
	});
});

app.post('/secureresources/test', function(req, res) {
	fs.readFile('./api/secureresources/test', function(err, data) {
		
		res.json(JSON.parse(data));
	});
});

app.get('/secureresources/plugins', function(req, res) {
	fs.readFile('./api/secureresources/plugins', function(err, data) {
		res.json(JSON.parse(data));
	});
});

app.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});

timestamp2date = (ts) => {
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

fullNumber = (n) => {return n < 10 ? '0' + n : n;}