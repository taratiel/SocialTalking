module.exports = {
	attributes: {
		nombre: {
			type: 'string',
			required: false
		},

		direccion: {
			type: 'string',
			required: false
		},

		lang: {
			type: 'string',
			required: false
		},

		position: {
			type: 'json',
			required: false
		}
	}
};

/* INSERT WITH POSTMAN
{
  "uuid": "4",
  "nombre": "Natalia",
  "direccion": "Calle Random 42",
  "lang": "en",
  "position": {"type": "Point", "coordinates": [41.661, -4.76]}
}
*/