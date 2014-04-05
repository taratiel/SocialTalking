'use strict';

$(document).ready(function(){

	//Bug en Foundation: https://github.com/zurb/foundation/issues/4371
	Foundation.set_namespace = function(){};
	$(document).foundation();

});

var app = angular.module('st', [
	'ngRoute',
	'ngResource',
	'ngSanitize',
	'AngularGM',
	'ngCookies',
	'ngGeolocation',
	'adaptive.googlemaps',
	'angularLocalStorage',
	'st.filters',
	'st.services',
	'st.directives',
	'st.controllers'
]);

app.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				if (callback) {
					callback.apply(socket, args);
				}
			});
			})
		}
	};
});

app.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/main', {
		templateUrl: '/templates/main',
		controller: 'MainCtrl'
	});

	$routeProvider.when('/chat/:id', {
		templateUrl: '/templates/chat',
		controller: 'ChatCtrl'
	});

	$routeProvider.otherwise({
		redirectTo: '/main'
	});

}]);