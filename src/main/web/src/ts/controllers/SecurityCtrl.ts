///<reference path="../services/auth.ts" />
'use strict'
module monitor.controllers {
	import AuthService = monitor.services.IAuth;
	import ErrorService = monitor.services.ErrorService;
	import DataService = monitor.services.DataService;
	import TranslateService = monitor.services.TranslateService;

	export class SecurityCtrl {
		private DEL_USER = 'saferesources/delUser';
		private RECOVER = 'resources/recover';
		private user: any;
		private delUser: any;
		private recoverUser: any = {loginEmail: ''};

		constructor(private authService: AuthService,
			private errorService: ErrorService,
			dataService: DataService,
			translate: TranslateService,
			private $http: ng.IHttpService,
			private $location: ng.ILocationService) {
			translate.translateAllByLocale(dataService.language());
		}

		logout(){
			this.authService.clear();
		}

		deleteUser(){
			this.$http.delete(this.DEL_USER, {
				params: this.delUser
			})
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
			if (u.loginEmail.length == 0) {
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
	}
}