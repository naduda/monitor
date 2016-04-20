///<reference path="../services/security/DataService.ts" />
///<reference path="../services/security/auth.ts" />
'use strict'
module monitor.controllers {
	import DataService = monitor.services.DataService;
	import AuthService = monitor.services.IAuth;

	export class MainCtrl {
		private userName: string;
		private command: string;
		private parameters: string;
		private result: string[];
		private plugins: string[] = [];

		constructor(dataService: DataService,
								$scope, $location: ng.ILocationService,
								private $http: ng.IHttpService,
								private authService: AuthService) {
			this.userName = dataService.login();
			this.command = 'c:/gradle/bin/gradle.bat';
			this.parameters = '-version';

			$http.get('secureresources/profileInfo')
			.success((data) => {
				console.log(data);
			});
			this.setPlugins();
		}

		test(){
			this.result = [];
			this.$http.post('secureresources/test', {
				command: this.command,
				params: this.parameters
			})
			.success((data, status, headers, config) => {
				for(var k in data){
					this.result.push(data[k]);
				}
			});
		}

		setPlugins(){
			this.$http.get('secureresources/plugins')
				.success(data => {
					for(var k in data){
						this.plugins.push(data[k]);
					}
					this.command = this.plugins[0];
				});
		}

		changePlugin(p){
			this.command = p;
		}

		logout(){
			this.authService.clear();
		}
	}
}