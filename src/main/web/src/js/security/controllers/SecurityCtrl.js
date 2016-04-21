///<reference path="../../security/services/auth.ts" />
///<reference path="../../security/services/ErrorService.ts" />
///<reference path="../../security/services/DataService.ts" />
///<reference path="../../security/services/TranslateService.ts" />
'use strict';
var security;
(function (security) {
    var controllers;
    (function (controllers) {
        var SecurityCtrl = (function () {
            function SecurityCtrl(authService, errorService, dataService, translate, $http, $location) {
                this.authService = authService;
                this.errorService = errorService;
                this.$http = $http;
                this.$location = $location;
                this.DEL_USER = 'saferesources/delUser';
                this.RECOVER = 'resources/recover';
                this.recoverUser = { loginEmail: '' };
                translate.translateAllByLocale(dataService.language());
            }
            SecurityCtrl.prototype.logout = function () {
                this.authService.clear();
            };
            SecurityCtrl.prototype.deleteUser = function () {
                var _this = this;
                this.$http.delete(this.DEL_USER, {
                    params: this.delUser
                })
                    .success(function (data) {
                    if (data.result === 'ok') {
                        _this.authService.clear();
                    }
                    else {
                        _this.errorService.setError('Bad result.');
                    }
                });
            };
            return SecurityCtrl;
        }());
        controllers.SecurityCtrl = SecurityCtrl;
    })(controllers = security.controllers || (security.controllers = {}));
})(security || (security = {}));
