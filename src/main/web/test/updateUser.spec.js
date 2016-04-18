describe('describe', () => {
	var mainURL = 'http://localhost:8088/index.html#/';

	it('update user', () => {
		browser.get(mainURL + 'login');
		updatePassword('q2', 'q');
		updateUser('q2', 'qUpdated');
	});

	var updateUser = (login, password) => {
		browser.getCurrentUrl().then(url => {
			if(url.indexOf('#/login') < 0){
				browser.setLocation('login');
			}
			element(by.model('credentials.username'))
				.clear().sendKeys(login);
			element(by.model('credentials.password'))
				.clear().sendKeys(password);
			element(by.css('button[type="submit"]'))
				.click();

			browser.setLocation('security');
			element(by.css('a[href="#/profile"]'))
				.click();
			element(by.model('reg.newUser.email'))
				.sendKeys('q2.changed@nik.net.ua');
			var nameInput = getInputsByValue('nameTest 2').first();
			nameInput.value = 'nameTest 2 changed';
			var ageInput = getInputsByValue('25').first();
			ageInput.value = '26';
			var heightInput = getInputsByValue('1.84').first();
			heightInput.value = 'nameTest 2 changed';
			var select = element(by.css('.col-xs-12 > .col-xs-4:nth-child(2) > select'));
			select.click();
			select.all(by.tagName('option')).get(1).click();
			var tsInput = getInputsByValue('nameTest 2').first();
			tsInput.value = '2016-05-01 00:00:00.000';
			element(by.css('button[type="submit"]')).click();
			console.log('****************************');
			console.log('4. Update user');
			console.log('****************************\n');
		});
	}

	var updatePassword = (login, password) => {
		browser.getCurrentUrl().then(url => {
			if(url.indexOf('#/login') < 0){
				browser.setLocation('login');
			}
			element(by.model('credentials.username'))
				.clear().sendKeys(login);
			element(by.model('credentials.password'))
				.clear().sendKeys(password);
			element(by.css('button[type="submit"]'))
				.click();

			browser.setLocation('security');
			element(by.css('a[href="#/profile"]'))
				.click();
			element(by.model('reg.newUser.password1'))
				.sendKeys('qUpdated');
			element(by.model('reg.newUser.password2'))
				.sendKeys('qUpdated');
			element.all(by.model('reg.newUser.password'))
				.get(1).sendKeys(password);
			element(by.css('button[type="submit"]')).click();
			console.log('****************************');
			console.log('3. Update password');
			console.log('****************************\n');
		});
	}

	getInputsByValue = value => {
		return element.all(by.tagName('input'))
			.filter((e, ind) => {
				return e.value === value;
			});
	}
});