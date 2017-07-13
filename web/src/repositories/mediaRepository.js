const model = require('../models/media').model;
const genericRepository = require('../repositories/genericRepository');

var mediaRepository = function() {
	var mediaRepository = genericRepository(model);
	return mediaRepository;
};

module.exports = mediaRepository();

