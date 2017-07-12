// node imports
const objToDotNotation = require('obj-to-dot-notation');
// app imports
const stringUtils = require('./stringUtils');
const utils = require('./utils');
const jwt = require('jwt-simple');
const config = require('config');

const BRACKET_OPEN = '(';
const COMA = ',';

var setRequestInfo = (req) => {

	var requestData = {};

	requestData.host = req.hostname;
	requestData.method = req.method;
	requestData.originalUrl = req.originalUrl;
	requestData.url = req.baseUrl;
	requestData.params = req.params;
	requestData.path = req.path;
	requestData.query = req.query;
	requestData.mobileRequest = typeof req.body.mobileRequest !== 'undefined' ? req.body.mobileRequest : false;
	requestData.body = req.body;

	if (typeof req.body.mobileRequest !== 'undefined') {
		delete req.body.mobileRequest;
	}

	if (typeof req.query.mobileRequest !== 'undefined') {
		delete req.query.mobileRequest;
	}

	setGet(requestData);
	setStatusParam(requestData);
	setBetween(requestData);
	setOrderBy(requestData);
	setAuth(requestData, req);

	if (req.method === 'PUT') {
		var data = req.body;
		if (requestData.mobileRequest) {
			data = objToDotNotation(req.body);
		}

		requestData.updateData = data;
	} else if (req.method === 'GET') {
		requestData.params = requestData.query;
	}  else if (req.method === 'POST') {
		requestData.params = requestData.body;
	}

	req.requestData = requestData;
};

function setGet(requestData) {
	if (hasGetParam(requestData)) {
		var queryData = requestData.query.get;

		if (queryData.indexOf(BRACKET_OPEN) < 0) {
			requestData.get = stringUtils.replaceAll(queryData, ',', ' ');
		} else {
			requestData.get = '';
		}
	} else {
		requestData.get = '';
	}

	delete requestData.query.get;
}

function hasGetParam(request) {
	var queryData = request.query;
	if (queryData && queryData.get != null) {
		return true;
	}
	return false;
}
// a = Active
// i = Inactive
// r = Removed
// m(anager) = Active & Inactive 
function setStatusParam(requestData) {

	var query = requestData.query;

	if (query && query.status) {
		switch (query.status.toUpperCase()) {
		case 'A':
		default:
			query.status = 2;
			break;
		case 'I':
			query.status = 1;
			break;
		case 'M':
			query.status = { $in: [1, 2] };
			break;
		}
	}
}

function setBetween(requestData) {
	var query = requestData.query;

	if (query && query.between) {
		var split = query.between.split(',');

		if (split.length < 3) {
			return;
		}
		var field = split[0];
		var start = split[1];
		
		const endSplit = split[2].split('-');

		if (endSplit.length < 3) {
			return;
		}

		let end = new Date(Date.UTC(endSplit[0], Number(endSplit[1]) - 1, endSplit[2], 0, 0, 0));
		end.setDate(end.getDate() + 1);

		query[field] = {
			$gte: start,
			$lte: stringUtils.dateToString(end)
		};

		delete requestData.query.between;
	}

}

function setOrderBy(requestData) {

	if (!hasOrderByParam(requestData)) {
		requestData.orderBy = { _id: 1 }; //defauld order by params
		delete requestData.query.orderBy;
		return;
	}

	var orderBy = requestData.query.orderBy;

	var toReturn = {};
	if (orderBy.indexOf(COMA) < 0) {
		requestData.orderBy = orderByToJson(orderBy, toReturn);
	} else {
		orderBy.split(COMA).forEach(function (element) {
			orderByToJson(element, toReturn);
		}, this);
		requestData.orderBy = toReturn;
	}
	delete requestData.query.orderBy;
}

function hasOrderByParam(request) {
	var queryData = request.query;
	if (queryData && queryData.orderBy != null) {
		return true;
	}
	return false;
}

function orderByToJson(orderBy, toReturn) {
	var fields = orderBy.split(':');
	var updown = fields[1] == 'ASC' ? -1 : 1;
	toReturn[fields[0]] = updown;
	return toReturn;
}

function setAuth(requestData, req) {
	var token = utils.getToken(req.headers);
	if (token != null) {
		try {
			var decoded = jwt.decode(token, config.get('crypt.cryptSalt'));
			requestData.user = decoded.iss;
		} catch (err) {
			console.log('Error decoding token: ' + err);
		}
	}
	if (requestData.user == null || requestData.user == '') {
		requestData.user = 'unknown';
	}
}

module.exports.setRequestInfo = setRequestInfo;