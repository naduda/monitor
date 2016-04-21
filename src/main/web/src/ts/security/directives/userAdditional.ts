///<reference path="../../../typings/angularjs/angular.d.ts" />
'use strict'
module security.directives {
	export function UserAdditional(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'html/security/directives/userAdditional.html',
			link: (scope: any, elm, attrs, ctrl) => {
				scope.reg.translateUpdate();
			}
		}
	}
}