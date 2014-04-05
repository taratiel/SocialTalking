module.exports.bootstrap = function (cb) {

	//db.persona.ensureIndex({ "position.coordinates": "2dsphere" })

	Persona.native(function(err, collection){
		collection.ensureIndex({
			"position.coordinates": "2dsphere"
		}, function(err, result){
			cb();
		})
	});

};