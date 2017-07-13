const model = require('../models/restaurantTemplate').model;
const genericRepository = require('../repositories/genericRepository');

var restaurantTemplateRepository = function() {
	var restaurantTemplateRepository = genericRepository(model);
	return restaurantTemplateRepository;
};

module.exports = restaurantTemplateRepository();
