// node imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Own collection
var props = {
     _id: {type: String, required: false},
    name: { type: String },
    tags: [{type: String}],
    lat: {type: Number},
    lng: {type: Number},
    address: {type: String},
    media: [{ type: String, ref: 'media' }],
    field1: {type: String},
    field2: {type: String},
    field3: {type: String}
}

var schema = new Schema(props, { timestamps: true });
schema.index({ '_id': 1});

schema.plugin(require('mongoose-deep-populate')(mongoose));

module.exports.schema = schema;
module.exports.model = mongoose.model('attractionTemplate', schema, 'attractionTemplate');
	    
    