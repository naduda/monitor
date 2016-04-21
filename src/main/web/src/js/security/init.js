///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../../typings/angularjs/angular.d.ts" />
///<reference path="./../security/controllers/SecurityCtrl.ts" />
///<reference path="./../security/controllers/Registration.ts" />
///<reference path="./../security/directives/Lang.ts" />
///<reference path="./../security/directives/Error.ts" />
///<reference path="./../security/directives/Enter.ts" />
///<reference path="./../security/directives/Login.ts" />
///<reference path="./../security/directives/userMain.ts" />
///<reference path="./../security/directives/userAdditional.ts" />
///<reference path="./../security/services/DataService.ts" />
///<reference path="./../security/services/translateService.ts" />
///<reference path="./../security/services/auth.ts" />
///<reference path="./../security/services/errorService.ts" />
///<reference path="./../security/filters.ts" />
(function () {
    var ctrls = security.controllers, dirs = security.directives, serv = security.services;
    var app = angular.module('Security', ['ngRoute', 'ngAnimate']);
    app.run(function (authService, $rootScope, $route, $timeout, translate, dataService) {
        authService.init('/', '/login', '/logout', ['/registration', '/recover']);
        $rootScope.$on("$includeContentLoaded", function (event, tName) {
            translate.translateAllByLocale(dataService.language());
        });
        $route.reload();
    });
    app.service('authInterceptorService', [serv.AuthInterceptorService])
        .service('authService', [
        '$rootScope', '$location', '$http',
        'translate', 'dataService',
        serv.Auth])
        .service('dataService', [serv.DataService])
        .service('translate', [serv.TranslateService])
        .service('errorService', ['$rootScope', serv.ErrorService]);
    app.directive('langDirective', [dirs.LangDirective])
        .directive('loginDirective', [dirs.Login])
        .directive('errorDirective', [dirs.Error])
        .directive('ngEnter', [dirs.Enter])
        .directive('userMain', [dirs.UserMain])
        .directive('userAdditional', [dirs.UserAdditional]);
    app.controller('SecurityCtrl', ctrls.SecurityCtrl)
        .controller('RegistrationCtrl', ctrls.RegistrationCtrl);
    var cFilters = new security.filters.CustomFilters(app);
    cFilters.setFilters();
})();
