const model = require('../models/tourist-guide-template').model;
const genericRepository = require('../repositories/genericRepository');

var touristGuideTemplateRepository = function() {
	var touristGuideTemplateRepository = genericRepository(model);
	return touristGuideTemplateRepository;
};

module.exports = touristGuideTemplateRepository();
