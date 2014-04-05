'use strict';

var srvcs = angular.module('st.services', []);

srvcs.value('version', '0.1');

srvcs.factory("Persona", function($resource){
	return $resource("", {}, {
			"get": {
				method: "GET",
				url: "/persona/find/:id"
			},
			"getNear": {
				method: "POST",
				url: "/persona/findNear",
				isArray: true
			},
			"save": {
				method: "POST",
				url: "/persona/save"
			}
		}
	);
});