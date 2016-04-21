///<reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
var security;
(function (security) {
    var directives;
    (function (directives) {
        function UserAdditional() {
            return {
                restrict: 'E',
                templateUrl: 'html/security/directives/userAdditional.html',
                link: function (scope, elm, attrs, ctrl) {
                    scope.reg.translateUpdate();
                }
            };
        }
        directives.UserAdditional = UserAdditional;
    })(directives = security.directives || (security.directives = {}));
})(security || (security = {}));
