describe('describe', () => {
	it('update user', () => {
		browser.get(browser.params.mainURL + 'login');
		updatePassword('q2', 'q', 'qUpdated');
		updateUser('q2', 'qUpdated');
		updatePassword('q2', 'qUpdated', 'q');
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
				.clear().sendKeys('q2.changed@nik.net.ua');
			setValue('name', 'nameTest 2 changed');
			setValue('age', 26);
			setValue('height', 1.80);
			setValue('createdtime','2016-05-01 00:00:00.000');
			element.all(by.model('reg.newUser.password'))
				.get(1).sendKeys(password);
			element(by.css('button[type="submit"]')).click();
			console.log('****************************');
			console.log('4. Update user');
			console.log('****************************\n');
		});
	}

	var updatePassword = (login, password, newPassword) => {
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
				.sendKeys(newPassword);
			element(by.model('reg.newUser.password2'))
				.sendKeys(newPassword);
			element.all(by.model('reg.newUser.password'))
				.get(1).sendKeys(password);
			element(by.css('button[type="submit"]')).click();
			console.log('****************************');
			console.log('3. Update password');
			console.log('****************************\n');
		});
	}

	var setValue = (fieldName, value) => {
		if(!isNaN(fieldName)) {
			var rowIndex = +fieldName;
			element.all(by.css('#customFields > div'))
				.get(rowIndex)
				.element(by.css('input[placeholder="value"]'))
				.clear().sendKeys(value);
		} else {
			element.all(by.css('input[placeholder="name"]'))
			.each((elem, ind) => {
				elem.getAttribute('value').then(text => {
					if(text.toLowerCase() === fieldName) {
						setValue(ind, value);
					}
				});
			});
		}
	}
});