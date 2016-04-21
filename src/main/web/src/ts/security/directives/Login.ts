///<reference path="../../security/services/errorService.ts" />
///<reference path="../../security/services/translateService.ts" />
///<reference path="../../security/services/DataService.ts" />
///<reference path="../../security/services/auth.ts" />
'use strict'
module security.directives {
		import ErrorService = security.services.ErrorService;
		import AuthService = security.services.Auth;
		import DataService = security.services.DataService;
		import TranslateService = security.services.TranslateService;

		interface ILogin extends ng.IScope {
				credentials: any;
				progressIconClass: string;
				login(): void;
				listen(): void;
		}

		class LoginController {
			constructor($scope: ILogin,
									errorService: ErrorService,
									authService: AuthService | any,
									private dataService: DataService,
									private translate: TranslateService) {
				$scope.credentials = {};
				// $scope.credentials.password = 'qwe';
				$scope.progressIconClass = '';

				$scope.login = () => {
					$scope.progressIconClass = 'fa fa-refresh fa-spin';
					authService.authenticate($scope.credentials,
						(authenticated) => {
							if (authenticated) {
								dataService.setLogin($scope.credentials.username, true);
								console.log("Login succeeded");
							} else {
								console.log("Login failed")
								$scope.progressIconClass = '';
								errorService.setError('keyBadAuthentication');
							}
					});
				};
			}
		}

		export function Login(): ng.IDirective {
			return {
				restrict: 'E',
				templateUrl: 'html/security/directives/loginDirective.html',
				controller: LoginController,
				link: (scope: any, elm, attrs, ctrl) => {
					scope.credentials.username = ctrl.dataService.login();
					$('input[type="password"]')[0].focus();
					ctrl.translate.translateAllByLocale(
							ctrl.dataService.language());
				}
			}
		}
}