///<reference path="../typings/jquery/jquery.d.ts" />
///<reference path="../typings/angularjs/angular.d.ts" />
///<reference path="./controllers/MainCtrl.ts" />
///<reference path="routeConfig.ts" />
(() => {
		var ctrls = monitor.controllers;
		var app = angular.module('Monitor', ['Security']);

		app.config(monitor.RouteConfig);
		app.controller('MainCtrl', ctrls.MainCtrl);
})();