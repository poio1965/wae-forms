// node imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Own collection
var props = {
	_id: {type: String, required: false},
	name : {type : String, required: true},
	type: {type : String, required: true},
	url: {type : String, required: true},
	when: { type: Date },
	who: { type: String },
	unattachedResource: { type: Boolean }
};
var schema = new Schema(props, { timestamps: true });
// var schemaRef = new Schema(props, { timestamps: true });

schema.plugin(require('mongoose-deep-populate')(mongoose));
// schemaRef.plugin(require('mongoose-deep-populate')(mongoose));

require('../utils/utils').initHistory(schema, 'media');

schema.index({ '_id': 1});

module.exports.model = mongoose.model('media', schema, 'media');
module.exports.schema = schema;
// module.exports.schemaRef = schemaRef;
