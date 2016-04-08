///<reference path="../services/ErrorService.ts" />
///<reference path="../services/httpService.ts" />
'use strict'
module monitor.controllers {
	import HTTPService = monitor.services.HTTPService;
	import ErrorService = monitor.services.ErrorService;
	import DataService = monitor.services.DataService;
	import TranslateService = monitor.services.TranslateService;

	export class RegistrationCtrl {
		private PROFILE = 'saferesources/profile';
		private UPDATE_PROFILE = 'saferesources/updateProfile';
		private ADD_USER = 'resources/addUser';
		private DEL_USER = 'saferesources/delUser';
		private RECOVER = 'resources/recover';

		private newUser: any = {
			login: 'q',
			email: 'q@gmail.com',
			password: 'qwe',
			password2: '',
			name: '',
			address: ''
		};

		constructor(
			private errorService: ErrorService,
			dataService: DataService,
			translate: TranslateService,
			private $http: ng.IHttpService,
			private $location: ng.ILocationService) {

			translate.translateAllByLocale(dataService.language());
		}

		addUser() {
			var u = this.newUser;
			if (u.password !== u.password2) {
				this.errorService.setError('Different passwords');
				return;
			}
			this.$http.post(this.ADD_USER, this.newUser)
			.success((data: any) => {
				console.log(data);
				if (data.result === 'ok') {
					this.$location.path('/securityTest');
				} else {
					this.errorService.setError('keyBadAuthentication');
				}
			});
		}
	}
}