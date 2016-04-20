///<reference path="../services/security/DataService.ts" />
///<reference path="../services/security/auth.ts" />
'use strict';
var monitor;
(function (monitor) {
    var controllers;
    (function (controllers) {
        var MainCtrl = (function () {
            function MainCtrl(dataService, $scope, $location, $http, authService) {
                this.$http = $http;
                this.authService = authService;
                this.plugins = [];
                this.userName = dataService.login();
                this.command = 'c:/gradle/bin/gradle.bat';
                this.parameters = '-version';
                $http.get('secureresources/profileInfo')
                    .success(function (data) {
                    console.log(data);
                });
                this.setPlugins();
            }
            MainCtrl.prototype.test = function () {
                var _this = this;
                this.result = [];
                this.$http.post('secureresources/test', {
                    command: this.command,
                    params: this.parameters
                })
                    .success(function (data, status, headers, config) {
                    for (var k in data) {
                        _this.result.push(data[k]);
                    }
                });
            };
            MainCtrl.prototype.setPlugins = function () {
                var _this = this;
                this.$http.get('secureresources/plugins')
                    .success(function (data) {
                    for (var k in data) {
                        _this.plugins.push(data[k]);
                    }
                    _this.command = _this.plugins[0];
                });
            };
            MainCtrl.prototype.changePlugin = function (p) {
                this.command = p;
            };
            MainCtrl.prototype.logout = function () {
                this.authService.clear();
            };
            return MainCtrl;
        }());
        controllers.MainCtrl = MainCtrl;
    })(controllers = monitor.controllers || (monitor.controllers = {}));
})(monitor || (monitor = {}));
