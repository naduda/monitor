///<reference path="../../security/services/errorService.ts" />
///<reference path="../../security/services/translateService.ts" />
///<reference path="../../security/services/DataService.ts" />
///<reference path="../../security/services/auth.ts" />
'use strict';
var security;
(function (security) {
    var directives;
    (function (directives) {
        var LoginController = (function () {
            function LoginController($scope, errorService, authService, dataService, translate) {
                this.dataService = dataService;
                this.translate = translate;
                $scope.credentials = {};
                // $scope.credentials.password = 'qwe';
                $scope.progressIconClass = '';
                $scope.login = function () {
                    $scope.progressIconClass = 'fa fa-refresh fa-spin';
                    authService.authenticate($scope.credentials, function (authenticated) {
                        if (authenticated) {
                            dataService.setLogin($scope.credentials.username, true);
                            console.log("Login succeeded");
                        }
                        else {
                            console.log("Login failed");
                            $scope.progressIconClass = '';
                            errorService.setError('keyBadAuthentication');
                        }
                    });
                };
            }
            return LoginController;
        }());
        function Login() {
            return {
                restrict: 'E',
                templateUrl: 'html/security/directives/loginDirective.html',
                controller: LoginController,
                link: function (scope, elm, attrs, ctrl) {
                    scope.credentials.username = ctrl.dataService.login();
                    $('input[type="password"]')[0].focus();
                    ctrl.translate.translateAllByLocale(ctrl.dataService.language());
                }
            };
        }
        directives.Login = Login;
    })(directives = security.directives || (security.directives = {}));
})(security || (security = {}));
