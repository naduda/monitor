///<reference path="../../security/services/auth.ts" />
///<reference path="../../security/services/ErrorService.ts" />
///<reference path="../../security/services/DataService.ts" />
///<reference path="../../security/services/TranslateService.ts" />
'use strict'
module security.controllers {
	import AuthService = security.services.IAuth;
	import ErrorService = security.services.ErrorService;
	import DataService = security.services.DataService;
	import TranslateService = security.services.TranslateService;

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
	}
}