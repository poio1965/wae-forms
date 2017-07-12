const model = require('../models/shop-template').model;
const genericRepository = require('../repositories/genericRepository');

var shopTemplateRepository = function() {
	var shopTemplateRepository = genericRepository(model);
	return shopTemplateRepository;
};

module.exports = shopTemplateRepository();
