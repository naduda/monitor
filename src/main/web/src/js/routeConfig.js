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
                templateUrl: 'html/login.html'
            })
                .when('/recover', {
                templateUrl: 'html/recover.html'
            })
                .when('/remove', {
                templateUrl: 'html/security/remove.html'
            })
                .otherwise('/security');
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            // $httpProvider.defaults.withCredentials = true;
            $httpProvider.interceptors.push('authInterceptorService');
        }
        return RouteConfig;
    }());
    monitor.RouteConfig = RouteConfig;
})(monitor || (monitor = {}));
