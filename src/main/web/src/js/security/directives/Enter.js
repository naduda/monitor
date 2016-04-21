///<reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
var security;
(function (security) {
    var directives;
    (function (directives) {
        function Enter() {
            return function (scope, element, attrs) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        }
        directives.Enter = Enter;
    })(directives = security.directives || (security.directives = {}));
})(security || (security = {}));
