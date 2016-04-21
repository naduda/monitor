///<reference path="../../security/services/translateService.ts" />
///<reference path="../../security/services/DataService.ts" />
'use strict'
module security.directives {
	import TranslateService = security.services.TranslateService;
	import DataService = security.services.DataService;

	interface ILangScope extends ng.IScope {
			lang: string;
			locales: any[];
			changeLanguage(id: string): void;
	}

	class LangController {
		private changeLocale: any;

		constructor($scope: ILangScope,
								$location: ng.ILocationService,
								$http: ng.IHttpService,
								private translate: TranslateService,
								private dataService: DataService,
								$timeout: ng.ITimeoutService) {

			$http.get('resources/langs', {cache: true})
			.success((response: string[]) => {
				var locales = [], index:number = 1;
				response.forEach((localeName:string) => {
					var locale:any = {};
					localeName = localeName.slice(
						localeName.indexOf('_') + 1,
						localeName.indexOf('.'));

					locale.id = localeName;
					locales.push(locale);
					$scope.lang = locales.filter((f) => {
							return f.id === dataService.language();
					})[0];

					translate.translateValueByKey(localeName, 
						['kFlagLocale', 'kLangName'], (value, k) => {
							if (value.indexOf('http') != -1) {
								locale.img = value;
							} else {
								locale.langName = value;
								if ((index++) == response.length) {
									$scope.locales = locales;
									translate.translateAllByLocale(dataService.language());
									$timeout();
								}
							}
						});
				});
			});

			$scope.changeLanguage = (id) => {
				translate.translateAllByLocale(id);
				$scope.lang = $scope.locales.filter((f) => {
						return f.id === id;
				})[0];
				dataService.setLanguage(id, true);
			}
		}
	}

	export function LangDirective(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'html/security/directives/langDirective.html',
			controller: LangController,
			link: (scope: any, elm, attrs, ctrl) => {
				scope.$on('$routeChangeStart', (next, current) => {
					scope.changeLanguage(ctrl.dataService.language());
				});
			}
		}
	}
}