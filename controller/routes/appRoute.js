var fs = require('fs');


var appRoute = {

	main: function(req, res) {

		res.render('index', {});
	},

	ceasar: function(req, res) {

		res.render('part/ceasar', {});
	},

	tritem: function(req, res) {

		res.render('part/trithemius', {});
	},

	mono: function(req, res) {

		res.render('part/monoalphabet', {});
	},

	veg: function(req, res) {

		res.render('part/veg', {});
	},

	playfair: function(req ,res) {

		res.render('part/playfair', {});
	},

	hill: function(req ,res) {

		res.render('part/hill', {});
	},

	graph: function(req ,res) {

		res.render('part/graph', {});
	}
}


module.exports = appRoute;