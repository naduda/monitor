///<reference path="../typings/jquery/jquery.d.ts" />
///<reference path="../typings/angularjs/angular.d.ts" />
///<reference path="./controllers/SecurityCtrl.ts" />
///<reference path="./controllers/MainCtrl.ts" />
///<reference path="./controllers/RegistrationCtrl.ts" />
///<reference path="./directives/Lang.ts" />
///<reference path="./directives/Error.ts" />
///<reference path="./directives/Enter.ts" />
///<reference path="./directives/Login.ts" />
///<reference path="./directives/security/userMain.ts" />
///<reference path="./directives/security/userAdditional.ts" />
///<reference path="./services/DataService.ts" />
///<reference path="./services/httpService.ts" />
///<reference path="./services/translateService.ts" />
///<reference path="./services/auth.ts" />
///<reference path="./services/errorService.ts" />
///<reference path="./filters.ts" />
///<reference path="routeConfig.ts" />
(function () {
    var ctrls = monitor.controllers, dirs = monitor.directives, servs = monitor.services;
    var app = angular.module('Monitor', ['ngRoute', 'ngAnimate']);
    app.config(monitor.RouteConfig)
        .run(function (authService, $rootScope, $route, $timeout, translate, dataService) {
        authService.init('/', '/login', '/logout', ['/registration', '/recover']);
        $rootScope.$on("$includeContentLoaded", function (event, tName) {
            translate.translateAllByLocale(dataService.language());
        });
        $route.reload();
    });
    app.service('authInterceptorService', [servs.AuthInterceptorService])
        .service('authService', [
        '$rootScope', '$location', '$http',
        'translate', 'dataService',
        servs.Auth])
        .service('dataService', [servs.DataService])
        .service('httpService', ['$http', 'authService', servs.HTTPService])
        .service('translate', [servs.TranslateService])
        .service('errorService', ['$rootScope', servs.ErrorService]);
    app.directive('langDirective', [dirs.LangDirective])
        .directive('loginDirective', [dirs.Login])
        .directive('errorDirective', [dirs.Error])
        .directive('ngEnter', [dirs.Enter])
        .directive('userMain', [dirs.UserMain])
        .directive('userAdditional', [dirs.UserAdditional]);
    app.controller('SecurityCtrl', ctrls.SecurityCtrl)
        .controller('MainCtrl', ctrls.MainCtrl)
        .controller('RegistrationCtrl', ctrls.RegistrationCtrl);
    var cFilters = new monitor.filters.CustomFilters(app);
    cFilters.setFilters();
})();
