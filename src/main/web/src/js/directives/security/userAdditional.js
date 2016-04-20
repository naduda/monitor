'use strict';
var monitor;
(function (monitor) {
    var directives;
    (function (directives) {
        function UserAdditional() {
            return {
                restrict: 'E',
                templateUrl: 'html/directives/security/userAdditional.html',
                link: function (scope, elm, attrs, ctrl) {
                    scope.reg.translateUpdate();
                }
            };
        }
        directives.UserAdditional = UserAdditional;
    })(directives = monitor.directives || (monitor.directives = {}));
})(monitor || (monitor = {}));
