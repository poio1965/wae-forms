// node imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Own collection
var props = {
    _id: {type: String, required: false},
	name: { type: String },
    media: [{ type: String, ref: 'media' }]
}

var schema = new Schema(props, { timestamps: true });
schema.index({ '_id': 1});

schema.plugin(require('mongoose-deep-populate')(mongoose));

module.exports.schema = schema;
module.exports.model = mongoose.model('restaurantTemplate', schema, 'restaurantTemplate');
    