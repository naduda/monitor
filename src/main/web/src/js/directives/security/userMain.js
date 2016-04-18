///<reference path="../../services/errorService.ts" />
///<reference path="../../services/translateService.ts" />
'use strict';
var monitor;
(function (monitor) {
    var directives;
    (function (directives) {
        function UserMain() {
            return {
                restrict: 'E',
                templateUrl: 'html/directives/security/userMain.html',
                link: function (scope, elm, attrs, ctrl) {
                    scope.reg.translateUpdate();
                }
            };
        }
        directives.UserMain = UserMain;
    })(directives = monitor.directives || (monitor.directives = {}));
})(monitor || (monitor = {}));
