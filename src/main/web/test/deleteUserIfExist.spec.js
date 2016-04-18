describe('describe', () => {
	var mainURL = 'http://localhost:8088/index.html#/';

	it('delete user', () => {
		browser.get(mainURL + 'login');
		removeUser('q', 'qwe');
		removeUser('q2', 'qUpdated');
	});

	var removeUser = (login, password) => {
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
			browser.getCurrentUrl().then(url => {
				if(url.indexOf('#/security') > 0){
					element(by.css('a[href="#/remove"]')).click();
					element(by.model('security.delUser.login'))
						.sendKeys(login);
					element(by.model('security.delUser.password'))
						.sendKeys(password);
					element(by.css('button[type="submit"]')).click();
					console.log('****************************');
					console.log('5. Remove user ' + login);
					console.log('****************************\n');
				} else {
					console.log('****************************');
					console.log('User ' + login + ' not exist');
					console.log('****************************\n');
				}
			});
		});
	}
});