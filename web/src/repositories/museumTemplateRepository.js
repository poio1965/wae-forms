const model = require('../models/museumTemplate').model;
const genericRepository = require('../repositories/genericRepository');

var museumTemplateRepository = function() {
	var museumTemplateRepository = genericRepository(model);
	return museumTemplateRepository;
};

module.exports = museumTemplateRepository();
