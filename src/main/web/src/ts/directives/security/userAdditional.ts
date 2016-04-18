///<reference path="../../services/errorService.ts" />
///<reference path="../../services/translateService.ts" />
'use strict'
module monitor.directives {
	import ErrorService = monitor.services.ErrorService;
	import TranslateService = monitor.services.TranslateService;

	export function UserAdditional(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'html/directives/security/userAdditional.html',
			link: (scope: any, elm, attrs, ctrl) => {
				scope.reg.translateUpdate();
			}
		}
	}
}