///<reference path="../services/ErrorService.ts" />
///<reference path="../services/httpService.ts" />
'use strict';
var monitor;
(function (monitor) {
    var controllers;
    (function (controllers) {
        var RegistrationCtrl = (function () {
            function RegistrationCtrl(errorService, dataService, translate, $http, $location) {
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
                    password2: '',
                    name: '',
                    address: ''
                };
                translate.translateAllByLocale(dataService.language());
            }
            RegistrationCtrl.prototype.addUser = function () {
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
            return RegistrationCtrl;
        }());
        controllers.RegistrationCtrl = RegistrationCtrl;
    })(controllers = monitor.controllers || (monitor.controllers = {}));
})(monitor || (monitor = {}));
