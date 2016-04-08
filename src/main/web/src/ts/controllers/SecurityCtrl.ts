///<reference path="../services/auth.ts" />
'use strict'
module monitor.controllers {
	import AuthService = monitor.services.IAuth;
	import ErrorService = monitor.services.ErrorService;
	import DataService = monitor.services.DataService;
	import TranslateService = monitor.services.TranslateService;

	export class SecurityCtrl {
		private PROFILE = 'saferesources/profile';
		private UPDATE_PROFILE = 'saferesources/updateProfile';
		private ADD_USER = 'resources/addUser';
		private DEL_USER = 'saferesources/delUser';
		private RECOVER = 'resources/recover';
		private user: any;
		private newUser: any = {
			login: 'q',
			email: 'q@gmail.com',
			password: 'qwe',
			password2: ''
		};
		private delUser: any;
		private recoverUser: any = {
			login: '',
			email: ''
		};

		constructor(private authService: AuthService,
			private errorService: ErrorService,
			dataService: DataService,
			translate: TranslateService,
			private $http: ng.IHttpService,
			private $location: ng.ILocationService) {
			$http.get(this.PROFILE)
			.success(data => {
				this.user = data;
			});
			translate.translateAllByLocale(dataService.language());
		}

		logout(){
			this.authService.clear();
		}

		addUser(){
			var u = this.newUser;
			if(u.password !== u.password2){
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

		deleteUser(){
			this.$http.post(this.DEL_USER, this.delUser)
			.success((data: any) => {
				if (data.result === 'ok') {
					this.authService.clear();
				} else {
					this.errorService.setError('Bad result.');
				}
			});
		}

		recover(){
			console.log('recover');
			var u = this.recoverUser;
			if(u.email.length == 0 && u.login.length == 0){
				this.errorService.setError('Bad result.');
			} else {
				this.$http.post(this.RECOVER, u)
				.success((data: any) => {
					if (data.result === 'ok') {
						this.authService.clear();
					} else {
						this.errorService.setError('Bad result.');
					}
				});
			}
		}

		check(){
			var u = this.user;
			if (u.password1 == undefined) {
				u.password1 = '';
			}
			if (u.password2 == undefined) {
				u.password2 = '';
			}
			if (u.password1 != u.password2){
				this.errorService.setError('Different passwords');
				return false;
			}
			return true;
		}

		updateProfile(){
			if (!this.check()) return;
			this.$http.post(this.UPDATE_PROFILE, this.user)
			.success((data: any) => {
				console.log(data);
				if(data.result === 'ok'){
					this.$location.path('/securityTest');
				} else {
					this.errorService.setError('keyBadAuthentication');
				}
			});
		}
	}
}