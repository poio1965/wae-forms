// node imports

// app imports
const requestInterceptor = require('./requestInterceptor');
const stringUtils = require('./stringUtils');


const BRACKET_OPEN = '(';
const BRACKET_CLOSE = ')';
const COMA = ',';


function getData() {

	var request = requestInterceptor.requestData;
	//console.log(request);
	if (!hasGetParam(request)) {
		return '';
	}

	var queryData = request.query.get;

	if (queryData.indexOf(BRACKET_OPEN) < 0) {
		return stringUtils.replaceAll(queryData, ',', ' ');
	}

	return '';
}

function hasGetParam(request) {
	var queryData = request.query;
	if (queryData && queryData.get != null) {
		return true;
	}
	return false;
}

function getOrderBy() {
	var request = requestInterceptor.requestData;

	if (!hasOrderByParam(request)) {
		return { _id: 1 }; //defauld order by params
	}

	var orderBy = request.query.orderBy;

	var toReturn = {};
	if (orderBy.indexOf(COMA) < 0) {
		return orderByToJson(orderBy, toReturn);
	} else {
		orderBy.split(COMA).forEach(function (element) {
			orderByToJson(element, toReturn);
		}, this);
		return toReturn;
	}
}

function orderByToJson(orderBy, toReturn) {
	var fields = orderBy.split(':');
	var updown = fields[1] == 'ASC' ? -1 : 1;
	toReturn[fields[0]] = updown;
	return toReturn;
}

function hasOrderByParam(request) {
	var queryData = request.query;
	if (queryData && queryData.orderBy != null) {
		return true;
	}
	return false;
}

// a = Active
// i = Inactive
// r = Removed
// m(anager) = Active & Inactive 
var setStatusParam = function (params) {

	var query = requestInterceptor.requestData.query;

	if (query && query.status) {
		switch (query.status.toUpperCase()) 
		{
		case 'A':
		default:
			params.status = 2;
			break;
		case 'I':
			params.status = 1;
			break;
		case 'M':
			params.status = { $in: [1, 2] };
			break;
		}
		return params;
	}
};

const checkBetween = function (params) {
	var query = requestInterceptor.requestData.query;

	if (query && query.between) {
		var split = query.between.split(',');

		if (split.length < 3) {
			return;
		}
		var field = split[0];
		var start = split[1];
		var end = split[2];

		params[field] = {
			$gte: start,
			$lte: end
		};

		delete params.between;
	}

};

module.exports.getData = getData;
module.exports.getOrderBy = getOrderBy;
module.exports.setStatusParam = setStatusParam;
module.exports.checkBetween = checkBetween;