///<reference path="../typings/angularjs/angular-route.d.ts" />
'use strict'
module monitor {
	export class RouteConfig{
		constructor($routeProvider: ng.route.IRouteProvider,
								$httpProvider: ng.IHttpProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'main.html'
				})
				.when('/security', {
					templateUrl: 'html/security/main.html'
				})
				.when('/profile', {
					templateUrl: 'html/security/registration.html'
				})
				.when('/registration', {
					templateUrl: 'html/security/registration.html'
				})
				.when('/login', {
					templateUrl: 'html/security/login.html'
				})
				.when('/recover', {
					templateUrl: 'html/security/recover.html'
				})
				.when('/remove', {
					templateUrl: 'html/security/remove.html'
				})
				.otherwise('/security');

			$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
			// $httpProvider.defaults.withCredentials = true;
			$httpProvider.interceptors.push('authInterceptorService');
		}
	}
}