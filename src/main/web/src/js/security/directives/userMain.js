///<reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
var security;
(function (security) {
    var directives;
    (function (directives) {
        function UserMain() {
            return {
                restrict: 'E',
                templateUrl: 'html/security/directives/userMain.html',
                link: function (scope, elm, attrs, ctrl) {
                    scope.reg.translateUpdate();
                }
            };
        }
        directives.UserMain = UserMain;
    })(directives = security.directives || (security.directives = {}));
})(security || (security = {}));
