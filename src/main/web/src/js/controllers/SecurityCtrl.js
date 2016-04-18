///<reference path="../services/auth.ts" />
'use strict';
var monitor;
(function (monitor) {
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
            SecurityCtrl.prototype.recover = function () {
                var _this = this;
                console.log('recover');
                var u = this.recoverUser;
                if (u.loginEmail.length == 0) {
                    this.errorService.setError('Bad result.');
                }
                else {
                    this.$http.post(this.RECOVER, u)
                        .success(function (data) {
                        if (data.result === 'ok') {
                            _this.authService.clear();
                        }
                        else {
                            _this.errorService.setError('Bad result.');
                        }
                    });
                }
            };
            return SecurityCtrl;
        }());
        controllers.SecurityCtrl = SecurityCtrl;
    })(controllers = monitor.controllers || (monitor.controllers = {}));
})(monitor || (monitor = {}));
