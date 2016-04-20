/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
///<reference path="../../services/security/errorService.ts" />
///<reference path="../../services/security/DataService.ts" />
'use strict';
var monitor;
(function (monitor) {
    var services;
    (function (services) {
        var AuthInterceptorService = (function () {
            function AuthInterceptorService($cookies, $log) {
                var interceptor = {};
                interceptor.response = function (rejection) {
                    if (rejection.status === 401) {
                        console.log('401 in interceptor');
                    }
                    return rejection;
                };
                return interceptor;
            }
            return AuthInterceptorService;
        }());
        services.AuthInterceptorService = AuthInterceptorService;
        var Auth = (function () {
            function Auth($rootScope, $location, $http, errorService, dataService) {
                var lsItem = localStorage.getItem(dataService.localStorageName());
                var cache = lsItem ? lsItem : null;
                var curLang = cache ? cache.language : 'en';
                var auth = {
                    loginPath: '/login',
                    registrationPath: '/registration',
                    logoutPath: '/logout',
                    homePath: '/',
                    path: $location.path(),
                    authenticated: false,
                    authenticate: function (credentials, callback) {
                        var headers = credentials && credentials.username ?
                            { authorization: "Basic " +
                                    btoa(unescape(encodeURIComponent(credentials.username +
                                        ':' + credentials.password)))
                            } : {};
                        var config = { headers: headers };
                        $http.get('resources/user', config)
                            .success(function (response, status) {
                            auth.authenticated = response.name ? true : false;
                            callback && callback(auth.authenticated);
                            if (auth.authenticated)
                                $location.path(auth.path == auth.loginPath ?
                                    auth.homePath : auth.path);
                            else
                                $location.path(auth.loginPath);
                        })
                            .error(function (response, status) {
                            auth.authenticated = false;
                            if (status === 401 && credentials.username) {
                                var userLockURL = 'resources/isUserLock/';
                                $http.get(userLockURL + credentials.username)
                                    .success(function (response) {
                                    response.result && (function () {
                                        errorService.setError(response.message, response.wait);
                                    })();
                                })
                                    .error(function (response) { return console.log(response); });
                            }
                            callback && callback();
                        });
                    },
                    clear: function () {
                        $location.path(auth.loginPath);
                        auth.authenticated = false;
                        $http.post(auth.logoutPath, null)
                            .success(function () { return console.log('Logout succeeded'); })
                            .error(function (response, status) {
                            return console.log(status !== 401 ?
                                'Logout failed' : 'Logout succeeded');
                        });
                    },
                    init: function (homePath, loginPath, logoutPath, safePath) {
                        auth.homePath = homePath;
                        auth.loginPath = loginPath;
                        auth.logoutPath = logoutPath;
                        auth.safePath = safePath;
                        auth.authenticate({}, function (authenticated) {
                            if (authenticated) {
                                $location.path(auth.path);
                            }
                        });
                        $rootScope.$on('$routeChangeStart', function () { return enter(); });
                    }
                };
                function enter() {
                    var path = $location.path();
                    if (path != auth.loginPath &&
                        auth.safePath.indexOf(path) < 0) {
                        auth.path = $location.path();
                        if (!auth.authenticated) {
                            $location.path(auth.loginPath);
                        }
                    }
                }
                return auth;
            }
            return Auth;
        }());
        services.Auth = Auth;
    })(services = monitor.services || (monitor.services = {}));
})(monitor || (monitor = {}));
