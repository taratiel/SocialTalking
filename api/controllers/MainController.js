module.exports = {
	_config: {},

	index: function(req, res){
		res.view('partials/index', {
			title: 'Social Talking'
		});
	},

	render_template: function(req, res){
		res.render('ng-partials/' + req.params['tpl'], {}, function(err, html){
			res.send(html);
		});
	}

};