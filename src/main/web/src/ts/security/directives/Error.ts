///<reference path="../../../typings/angularjs/angular.d.ts" />
///<reference path="../../security/services/ErrorService.ts" />
///<reference path="../../security/services/TranslateService.ts" />
///<reference path="../../security/services/DataService.ts" />
'use strict';
module security.directives {
	import ErrorService = security.services.ErrorService;
	import TranslateService = security.services.TranslateService;
	import DataService = security.services.DataService;

	interface IError {
			error: string;
			text: string;
	}

	class ErrorController {
			constructor($scope: any, $sce: ng.ISCEService,
									errorService: ErrorService,
									translate: TranslateService,
									dataService: DataService) {
				var _this: any = this;

				_this.close = () => {
						_this.langKey = '';
						_this.message = '';
						_this.show = false;
				};

				$scope.$on('errorChange', (e, args: IError) => {
					if (args.error) {
							_this.show = true;
							translate.translateValueByKey(
								dataService.language(), args.error, (value) => {
										_this.message = $sce.trustAsHtml(value +
												(args.text ? ' ' + args.text : ''));
										_this.langKey = args.error;
										setTimeout(() => $scope.$apply(), 100);
								});
					} else {
						_this.close();
					}
				});
			}
	}

	export function Error(): ng.IDirective {
			return {
					templateUrl: 'html/security/directives/errorDirective.html',
					controller: ErrorController,
					controllerAs: 'errCtrl'
			}
	}
}