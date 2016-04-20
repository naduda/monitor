'use strict'
module monitor.directives {
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