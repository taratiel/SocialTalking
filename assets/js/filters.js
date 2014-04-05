'use strict';

var fltrs = angular.module('st.filters', []);

fltrs.filter('interpolate', ['version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}]);

fltrs.filter('distancia', function(){
	return function(distancia){
		if(distancia < 1000){
			return distancia + "m";
		}else if(distancia > 1000){
			return (distancia / 1024).toFixed(2) + "km"
		}
	}
});

fltrs.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});