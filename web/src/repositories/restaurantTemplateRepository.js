const model = require('../models/restaurant-template').model;
const genericRepository = require('../repositories/genericRepository');

var restaurantTemplateRepository = function() {
	var restaurantTemplateRepository = genericRepository(model);
	return restaurantTemplateRepository;
};

module.exports = restaurantTemplateRepository();
