describe('describe', () => {
	var mainURL = 'http://localhost:8088/index.html#/';

	it('create user', () => {
		browser.get(mainURL + 'login');
		createUserWrapper();
		createUserWrapper();
	});

	var createUserWrapper = () => {
		browser.getCurrentUrl().then(url => {
			if(url.indexOf('#/login') < 0){
				browser.setLocation('login');
			}
			element(by.css('a[href="#/registration"]')).click();
			element(by.css('div[ng-show="reg.createTable"]'))
				.isDisplayed()
				.then(isVisible => {
					createUser(isVisible);
				});
		});
	}

	var createUser = (isFirst) => {
		element(by.model('reg.newUser.login'))
			.sendKeys(isFirst ? 'q' : 'q2');
		element(by.model('reg.newUser.email'))
			.sendKeys(isFirst ? 'q@gmail.com' : 'q2@nik.net.ua');
		element.all(by.model('reg.newUser.password'))
			.get(0).sendKeys(isFirst ? 'qwe' : 'q');
		element(by.model('reg.newUser.password2'))
			.sendKeys(isFirst ? 'qwe' : 'q');

		isFirst && addField();
		isFirst && setName(0, 'name');
		setValue(0, isFirst ? 'nameTest' : 'nameTest 2');

		isFirst && addField();
		isFirst && setType(1, 'integer');
		isFirst && setName(1, 'age');
		setValue(1, isFirst ? 33 : 25);

		isFirst && addField();
		isFirst && setType(2, 'double');
		isFirst && setName(2, 'height');
		setValue(2, isFirst ? 1.87 : 1.85);

		isFirst && addField();
		isFirst && setType(3, 'boolean');
		isFirst && setName(3, 'isactive');

		isFirst && addField();
		isFirst && setType(4, 'timestamp');
		isFirst && setName(4, 'createdtime');
		isFirst && setValue(4, '2016-02-23 00:00:00.000');

		element(by.css('button[type="submit"]')).click();
		console.log('****************************');
		if(isFirst){
			console.log('1. Create first user ');
		} else {
			console.log('2. Create second user ');
		}
		console.log('****************************\n');
	}

	var addField = () => {
		element(by.css('[ng-click="reg.addUserField();"]'))
		.click();
	}

	var setName = (rowIndex, value) => {
		return element.all(by.css('#customFields > div'))
			.get(rowIndex)
			.element(by.css('input[placeholder="name"]'))
			.sendKeys(value);
	}

	var setValue = (rowIndex, value) => {
		return element.all(by.css('#customFields > div'))
			.get(rowIndex)
			.element(by.css('input[placeholder="value"]'))
			.sendKeys(value);
	}

	var setType = (rowIndex, type) => {
		var index = 0;
		switch (type.toLowerCase()) {
			case 'integer': index = 1; break;
			case 'double': index = 2; break;
			case 'boolean': index = 3; break;
			case 'timestamp': index = 4; break;
		}
		element.all(by.css('#customFields > div'))
			.get(rowIndex).element(by.css('select'))
			.all(by.tagName('option')).get(index).click();
	}
});