'use strict';

var drctvs = angular.module('st.directives', []);

drctvs.directive('appVersion', ['version', function(version){
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

drctvs.directive('autoh', ['$window', function($window){
	return {
		link: function(scope, elem, attrs){
			var win = angular.element($window);
			win.bind("resize",function(e){

				elem.css('height', 

					$('.main-section').height() - 
					parseInt($('.resultados label.radius').css('line-height')) -
					parseInt($('.resultados').css('margin-top')) -
					parseInt($('.mapa').css('margin-top')) -
					$('.creditos').height() -
					80

				);
			})
		}
	}
}]);