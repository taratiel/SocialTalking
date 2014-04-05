'use strict';

var ctrls = angular.module('st.controllers', []);

ctrls.controller('MainCtrl', function($scope, socket, $timeout, $interval, $http, $location, $geolocation, storage, Persona){

	/* Variables para controlar el estado de la aplicacion */
	$scope.loading = true;			// Estamos cargando algo?
	$scope.langs = isoLangs;		// Lenguas disponibles
	$scope.personas_cercanas = [];	// Array para los resultados (personas mas cercanas)
	$scope.use_gps = true;			// true == usar GPS | false == usar direccion
	$scope.gps_settings = {			// Opciones para la deteccion via GPS
		timeout: 60000,				//60sec
		maximumAge: 15000,			//15sec
		enableHighAccuracy: false
	};
	$scope.geocoder = new google.maps.Geocoder();

	$scope.results_map = {
		zoom: 14,
		bounds: new google.maps.LatLngBounds(),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.static_map = {
		zoom: 14,
		markers: [],
		listen: true,
		sensor: false,
		center: "auto",
		size: "200x150",
		mapevents: false
	};

	$scope.buscar_mi_pos = _.debounce(function(){

		console.log("buscar_mi_pos()");

		var update_static_map = function(){
			$scope.static_map.center = $scope.me.direccion;
			$scope.static_map.markers = [$scope.me.direccion];
		}

		if($scope.use_gps){ // Obtenemos la direccion a partir de las coordenadas
			if(!$geolocation.position || !$geolocation.position.coords) return;

			var pos = $geolocation.position.coords;
			var coords = [pos.latitude, pos.longitude];

			if(_.isEqual($scope.me.position.coordinates, coords)) return;

			$scope.me.position.coordinates = coords;

			$scope.geocoder.geocode({
				latLng: new google.maps.LatLng(pos.latitude, pos.longitude)
			}, function(result, status){
				if(_.size(result) == 0) return;

				$timeout(function(){
					$scope.me.direccion = result[0].formatted_address;
					update_static_map();
				}, 0, true);
			});
		}else{ // Obtenemos las coordenadas a partir de la direccion
			$scope.geocoder.geocode({
				address: $scope.me.direccion
			}, function(result, status){
				if(!result || _.size(result) == 0) return;

				var pos = result[0].geometry.location;
				$timeout(function(){
					$scope.me.position.coordinates = [pos.k, pos.A];
					update_static_map();
				}, 0, true);
			});
		}
	}, 2000);

	$scope.buscar_cercanos = function(){
		console.log("buscar_cercanos()");
		if(_.isEqual($scope.me.position.coordinates, [0, 0])) return;

		$scope.loading = true;
		Persona.getNear({
			maxDistance: 5000,
			location: $scope.me.position,
			lang: $scope.me.lang,
			exclude: $scope.me._id
		}, function(data, status, headers, config){
			$scope.loading = false;
			$scope.personas_cercanas = data;

			/* Centrar automaticamente el mapa de personas cercanas */
			var bound = new google.maps.LatLngBounds();
			_.each(data, function(pos){
				var coords = pos.position.coordinates;
				bound.extend(new google.maps.LatLng(coords[0], coords[1]));
			});

			/* Corregir el tamaño del mapa de personas cercanas */
			$timeout(function(){
				$scope.results_map.bounds = bound;
				$(window).trigger('resize');
				$scope.$broadcast('gmMapResize', 'results_map');
			}, 0, true);

		});
	}

	$scope.start_chat = function(persona, marker){
		console.log(persona, marker);
		$location.path("/chat/{_id}".assign(persona));
	}

	/* Datos del usuario */
	$scope.id = storage.get('id') === null ? "new" : storage.get('id');
	Persona.get({id: $scope.id}, function(data){
		$scope.me = data;
		storage.set('id', data._id);

		/* Empezamos a monitorizar el GPS del usuario y la direccion que ha introducido */
		$geolocation.watchPosition($scope.gps_settings);
		$scope.$on("$geolocation.position.changed", $scope.buscar_mi_pos);

		/* Tras un cambio en la posicion, buscar personas en un radio de N km. que coincidan con las preferencias del usuario*/
		$scope.$watch("[me.lang, me.position.coordinates]", $scope.buscar_cercanos, true);

		/* Actualizar nuestro datos cada vez que cambiamos algo */
		$scope.$watch("me", function(){
			Persona.save($scope.me, function(data){
				//
			});
		}, true);

	});

});

ctrls.controller('ChatCtrl', function($scope, $routeParams, $http, $location, Persona){

	Persona.get({id: $routeParams.id}, function(persona){
		$scope.persona = persona;
	});

});