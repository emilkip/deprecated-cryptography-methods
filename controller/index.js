var express = require('express'),
	appRoute = require('./routes/appRoute');

var route = express.Router();



route.get('/', appRoute.main);

route.get('/ceasar', appRoute.ceasar);

route.get('/tritemius', appRoute.tritem);

route.get('/playfair', appRoute.playfair);

route.get('/veg', appRoute.veg);

route.get('/mono_alphabet', appRoute.mono);

route.get('/hill', appRoute.hill);

route.get('/graph_tools', appRoute.graph);



module.exports = route;