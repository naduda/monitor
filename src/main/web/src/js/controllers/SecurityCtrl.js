///<reference path="../services/auth.ts" />
'use strict';
var monitor;
(function (monitor) {
    var controllers;
    (function (controllers) {
        var SecurityCtrl = (function () {
            function SecurityCtrl(authService, errorService, dataService, translate, $http, $location) {
                var _this = this;
                this.authService = authService;
                this.errorService = errorService;
                this.$http = $http;
                this.$location = $location;
                this.PROFILE = 'saferesources/profile';
                this.UPDATE_PROFILE = 'saferesources/updateProfile';
                this.ADD_USER = 'resources/addUser';
                this.DEL_USER = 'saferesources/delUser';
                this.RECOVER = 'resources/recover';
                this.newUser = {
                    login: 'q',
                    email: 'q@gmail.com',
                    password: 'qwe',
                    password2: ''
                };
                this.recoverUser = {
                    login: '',
                    email: ''
                };
                $http.get(this.PROFILE)
                    .success(function (data) {
                    _this.user = data;
                });
                translate.translateAllByLocale(dataService.language());
            }
            SecurityCtrl.prototype.logout = function () {
                this.authService.clear();
            };
            SecurityCtrl.prototype.addUser = function () {
                var _this = this;
                var u = this.newUser;
                if (u.password !== u.password2) {
                    this.errorService.setError('Different passwords');
                    return;
                }
                this.$http.post(this.ADD_USER, this.newUser)
                    .success(function (data) {
                    console.log(data);
                    if (data.result === 'ok') {
                        _this.$location.path('/securityTest');
                    }
                    else {
                        _this.errorService.setError('keyBadAuthentication');
                    }
                });
            };
            SecurityCtrl.prototype.deleteUser = function () {
                var _this = this;
                this.$http.post(this.DEL_USER, this.delUser)
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
                if (u.email.length == 0 && u.login.length == 0) {
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
            SecurityCtrl.prototype.check = function () {
                var u = this.user;
                if (u.password1 == undefined) {
                    u.password1 = '';
                }
                if (u.password2 == undefined) {
                    u.password2 = '';
                }
                if (u.password1 != u.password2) {
                    this.errorService.setError('Different passwords');
                    return false;
                }
                return true;
            };
            SecurityCtrl.prototype.updateProfile = function () {
                var _this = this;
                if (!this.check())
                    return;
                this.$http.post(this.UPDATE_PROFILE, this.user)
                    .success(function (data) {
                    console.log(data);
                    if (data.result === 'ok') {
                        _this.$location.path('/securityTest');
                    }
                    else {
                        _this.errorService.setError('keyBadAuthentication');
                    }
                });
            };
            return SecurityCtrl;
        }());
        controllers.SecurityCtrl = SecurityCtrl;
    })(controllers = monitor.controllers || (monitor.controllers = {}));
})(monitor || (monitor = {}));
