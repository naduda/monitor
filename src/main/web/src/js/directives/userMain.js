///<reference path="../services/errorService.ts" />
///<reference path="../services/translateService.ts" />
'use strict';
var monitor;
(function (monitor) {
    var directives;
    (function (directives) {
        var UserMain = (function () {
            function UserMain(errorService, translate) {
                this.translate = translate;
            }
            return UserMain;
        }());
        function Login() {
            return {
                restrict: 'E',
                templateUrl: 'html/directives/loginDirective.html',
                controller: UserMain,
                link: function (scope, elm, attrs, ctrl) {
                }
            };
        }
        directives.Login = Login;
    })(directives = monitor.directives || (monitor.directives = {}));
})(monitor || (monitor = {}));
