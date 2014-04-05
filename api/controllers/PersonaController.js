module.exports = {

	_config: {},

	find: function(req, res){
		Persona.native(function(err, collection){
			if(req.params.id == "new"){
				Persona.create({
					nombre: "",
					direccion: "",
					lang: "",
					position: {"type": "Point", "coordinates": [0, 0]}
				}).done(function(err, persona){
					persona._id = persona.id;
					delete persona.id;
					res.json(persona);
				});
			}else{
				collection.findOne({
					_id: collection.pkFactory(req.params.id)
				}, function(err, result){
					res.json(result);
				});
			}
		});
	},

	findNear: function(req, res){
		Persona.native(function(err, collection){
			collection.find({
				"position.coordinates": {
					$near: {
						$geometry: req.body.location,
						$maxDistance: req.body.maxDistance
					}
				},
				"lang": req.body.lang,
				"_id": { $ne: collection.pkFactory(req.body.exclude) }
			}, {}).toArray(function(err, result){
				res.json(result);
			})
		});
	},

	save: function(req, res){
		Persona.native(function(err, collection){
			var data = req.body;
			var _id = collection.pkFactory(data._id);

			delete data._id;
			delete data.createdAt;
			delete data.updatedAt;

			collection.update({
				_id: _id
			}, data, function(err, result){
				//
			});
		});
	}

};