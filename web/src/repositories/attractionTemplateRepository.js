const model = require('../models/attraction-template').model;
const genericRepository = require('../repositories/genericRepository');

var attractionTemplateRepository = function() {
	var attractionTemplateRepository = genericRepository(model);
	return attractionTemplateRepository;
};

module.exports = attractionTemplateRepository();
