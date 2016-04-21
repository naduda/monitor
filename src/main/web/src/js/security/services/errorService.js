/// <reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
var security;
(function (security) {
    var services;
    (function (services) {
        var ErrorService = (function () {
            function ErrorService($rootScope) {
                this.$rootScope = $rootScope;
            }
            ErrorService.prototype.setError = function (value, text) {
                this.$rootScope.$broadcast('errorChange', {
                    error: value,
                    text: text
                });
            };
            return ErrorService;
        }());
        services.ErrorService = ErrorService;
    })(services = security.services || (security.services = {}));
})(security || (security = {}));
