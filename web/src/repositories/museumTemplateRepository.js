const model = require('../models/museum-template').model;
const genericRepository = require('../repositories/genericRepository');

var museumTemplateRepository = function() {
	var museumTemplateRepository = genericRepository(model);
	return museumTemplateRepository;
};

module.exports = museumTemplateRepository();
