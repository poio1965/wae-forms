const moment = require('moment');
var mongoose = require('mongoose');
const config = require('config');

const four0four = require('./404')();

const requiredFields = config.get('requiredFields');

var clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

var errorHandling = function (error, req, res) {
	if (error.type !== null && error.type === 'notFound') {
		four0four.send404(req, res, error.message);
	} else {
		throw new Error(error);
	}
};

var extend = function (source, obj) {
	for (var i in obj) {
		if (typeof obj.hasOwnProperty !== 'undefined' && obj.hasOwnProperty(i)) {
			source[i] = obj[i];
		}
	}
};

var initHistory = function(schema, name) {
	var mongoose = require('mongoose');
	schema.plugin(require('mongoose-patch-history').default,  { 
		name: '~hist_' + name, 
		mongoose,  
		removePatches: false, 
		includes: { 
			_user: { type: String, required: true },
			_op: { type: String, required: true }
		}
	});
};

var getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};



const flatten = arr => arr.reduce(
	(acc, val) => acc.concat(
		Array.isArray(val) ? flatten(val) : val
	),
	[]
);

const addMonth = function (date, months) {
	if (typeof months === 'undefined') {
		months = 1;
	}
	return moment(date).add(months, 'M').toDate();
};

const addDay = function (date, days) {
	if (typeof days === 'undefined') {
		days = 1;
	}
	return moment(date).add('days', days).toDate();
};

const generateIds = function (obj) {
	//console.log('generating ids');
	for (var property in obj) {
		if (property !== '_id') {
			if (obj.hasOwnProperty(property)) {
				if (Array.isArray(obj[property])) {
					obj[property].forEach(o => {
						generateIds(o);
					});
				}
				else if (typeof obj[property] === 'object') {
					generateIds(obj[property]);
				}
			}
		} else {
			if (obj.hasOwnProperty(property)) {
				obj._id = mongoose.Types.ObjectId();
			}
		}
	}
};

const getNewObjectId = function () {
	return new mongoose.Types.ObjectId();
};

const getNewObjectIdString = function () {
	return new mongoose.Types.ObjectId().toString();
};

const generateIdIfEmpty = function (item) {
	if (typeof item._id == 'undefined' || item._id == null) {
		item._id = getNewObjectIdString();
	}
};

// const removeNotValid = function (obj) {

// 	if (obj == null) {
// 		return;
// 	}

// 	for (var property in obj) {

// 		try {
// 			if (obj.hasOwnProperty(property)) {
// 				if (Array.isArray(obj[property])) {
// 					obj[property].forEach(o => {
// 						removeNotValid(o);
// 					});
// 				}
// 				else if (typeof obj[property] === 'object') {
// 					removeNotValid(obj[property]);
// 				}
// 				else {
// 					if (obj[property] === ':notValid') {
// 						obj[property] = null;
// 					}
// 				}
// 			}
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// };

const setStatus = function(item, type) {
	const typeRequiredFields = requiredFields[type];
	item.status = 2; // Set by default as active item
	if (typeRequiredFields) {
		typeRequiredFields.forEach(fieldName => {
			// If the item doesn't own the property it is set as inactive
			if (!item[fieldName] || (Array.isArray(item[fieldName]) && item[fieldName].length === 0)) {
				item.status = 1; // Status = inactive
				return;
			}
		});
	}	
};

Array.prototype.move = function (old_index, new_index) {
	if (new_index >= this.length) {
		var k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	return this; // for testing purposes
};

Array.prototype.sortUnique = function () {
	this.sort();
	var last_i;
	for (var i = 0; i < this.length; i++)
		if ((last_i = this.lastIndexOf(this[i])) !== i)
			this.splice(i + 1, last_i - i);
	return this;
};

module.exports.clone = clone;
module.exports.errorHandling = errorHandling;
module.exports.extend = extend;
module.exports.initHistory = initHistory;
module.exports.getToken = getToken;
module.exports.flatten = flatten;
module.exports.addMonth = addMonth;
module.exports.generateIds = generateIds;
module.exports.getNewObjectId = getNewObjectId;
module.exports.getNewObjectIdString = getNewObjectIdString;
module.exports.generateIdIfEmpty = generateIdIfEmpty;
// module.exports.removeNotValid = removeNotValid;
module.exports.addDay = addDay;
module.exports.setStatus = setStatus;
