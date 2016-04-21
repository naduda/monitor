///<reference path="../../typings/angularjs/angular-route.d.ts" />
'use strict';
var security;
(function (security) {
    var RouteConfig = (function () {
        function RouteConfig($routeProvider, $httpProvider) {
            $routeProvider
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
            });
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            // $httpProvider.defaults.withCredentials = true;
            $httpProvider.interceptors.push('authInterceptorService');
        }
        return RouteConfig;
    }());
    security.RouteConfig = RouteConfig;
})(security || (security = {}));
