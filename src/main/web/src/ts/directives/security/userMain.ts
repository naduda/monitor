'use strict'
module monitor.directives {
	export function UserMain(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'html/directives/security/userMain.html',
			link: (scope: any, elm, attrs, ctrl) => {
				scope.reg.translateUpdate();
			}
		}
	}
}