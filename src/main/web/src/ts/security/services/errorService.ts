/// <reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
module security.services {
	export class ErrorService {
		constructor(private $rootScope: ng.IRootScopeService) {}

		setError(value: string, text?: string): void {
			this.$rootScope.$broadcast('errorChange', {
					error: value,
					text: text
			});
		}
	}
}