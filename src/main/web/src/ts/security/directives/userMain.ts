///<reference path="../../../typings/angularjs/angular.d.ts" />
'use strict'
module security.directives {
	export function UserMain(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'html/security/directives/userMain.html',
			link: (scope: any, elm, attrs, ctrl) => {
				scope.reg.translateUpdate();
			}
		}
	}
}