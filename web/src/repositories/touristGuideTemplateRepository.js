const model = require('../models/touristGuideTemplate').model;
const genericRepository = require('../repositories/genericRepository');

var touristGuideTemplateRepository = function() {
	var touristGuideTemplateRepository = genericRepository(model);
	return touristGuideTemplateRepository;
};

module.exports = touristGuideTemplateRepository();
