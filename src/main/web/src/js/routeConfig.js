///<reference path="../typings/angularjs/angular-route.d.ts" />
'use strict';
var monitor;
(function (monitor) {
    var RouteConfig = (function () {
        function RouteConfig($routeProvider, $httpProvider) {
            $routeProvider
                .when('/', {
                templateUrl: 'main.html'
            })
                .when('/securityTest', {
                templateUrl: 'html/security/main.html'
            })
                .when('/securityProfile', {
                templateUrl: 'html/security/profile.html'
            })
                .when('/securityRegistration', {
                templateUrl: 'html/security/registration.html'
            })
                .when('/login', {
                templateUrl: 'html/login.html'
            })
                .when('/recover', {
                templateUrl: 'html/recover.html'
            })
                .when('/registration', {
                templateUrl: 'html/registration.html'
            })
                .when('/remove', {
                templateUrl: 'html/security/remove.html'
            })
                .when('/metersData/:ids', {
                templateUrl: 'html/templates/menu/menu_2_1/metersData.html',
            })
                .otherwise('/main');
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            // $httpProvider.defaults.withCredentials = true;
            $httpProvider.interceptors.push('authInterceptorService');
        }
        return RouteConfig;
    }());
    monitor.RouteConfig = RouteConfig;
})(monitor || (monitor = {}));
