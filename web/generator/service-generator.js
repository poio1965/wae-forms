'use strict';

var fs = require('fs');
var utils = require('./utils');
var serviceFolder = '../src//services/';
// writes down schema content.
function createFileContent(fd, name, pluralName, cb) {
	// Const
	var TAB = '\t';
	var NL = '\r\n';

	var constBlock =
		'// node imports' + NL +
		'// app imports' + NL +
		'const requestInterceptor = require(\'../utils/requestInterceptor\');' + NL +
		'const repository = require(\'../repositories/' + name + 'Repository\');' + NL +
		'const model = require(\'../models/' + name + '\').model;' + NL +
		'const utils = require(\'../utils/utils\');' + NL +
		'const four0four = require(\'../utils/404\')();' + NL + NL;

	var listBlock =
		'var getAll = function (req, res, next) {' + NL +
		
		TAB + 'repository.getAll(req.requestData).then((response) => {' + NL +
		TAB + TAB + 'res.json(response);' + NL +
		TAB + '}).catch((error) => {' + NL +
		TAB + TAB + 'throw new Error(error);' + NL +
		TAB + '});' + NL +
		'};' + NL + NL;


	var createBlock =
		'var create = function(req, res, next){' + NL +
		

		TAB + 'repository.create(req.body).then((response)=>{' + NL +
		TAB + TAB + 'res.header(\'Location\', response._id);' + NL +
		TAB + TAB + 'res.json(response);' + NL +
		TAB + '}).catch((error)=>{' + NL +
		TAB + TAB + 'throw new Error(error);' + NL +
		TAB + '});' + NL +
		'};' + NL + NL;

	var readBlock =
		'var find = function(req, res, next){' + NL +
		
		TAB + 'repository.find(req.requestData).then((response)=>{' + NL +
		TAB + TAB + 'res.json(response);' + NL +
		TAB + '}).catch((error)=>{' + NL +
		TAB + TAB + 'if (error.type !== null && error.type === \'notFound\'){' + NL +
		TAB + TAB + TAB + 'four0four.send404(req, res,error.message);' + NL +
		TAB + TAB + '} else {' + NL +
		TAB + TAB + TAB + 'throw new Error(error);' + NL +
		TAB + TAB + '}' + NL +
		TAB + '});' + NL +
		'};' + NL + NL;

	var updateBlock =
		'var update = function(req, res, next){' + NL +
		
		TAB + 'repository.update(req.params.id, req.requestData, req.body).then((response)=>{' + NL +
		TAB + TAB + 'res.json(response);' + NL +
		TAB + '}).catch((error)=>{' + NL +
		TAB + TAB + 'if (error.type !== null && error.type === \'notFound\'){' + NL +
		TAB + TAB + TAB + 'four0four.send404(req, res,error.message);' + NL +
		TAB + TAB + '} else {' + NL +
		TAB + TAB + TAB + 'throw new Error(error);' + NL +
		TAB + TAB + '}' + NL +
		TAB + '});' + NL +
		'};' + NL + NL;

	var deleteBlock =
		'var remove = function(req, res, next){' + NL +
		
		TAB + 'repository.remove(req.params.id).then((response)=>{' + NL +
		TAB + TAB + 'res.json(response);' + NL +
		TAB + '}).catch((error)=>{' + NL +
		TAB + TAB + 'if (error.type !== null && error.type === \'notFound\'){' + NL +
		TAB + TAB + TAB + 'four0four.send404(req, res,error.message);' + NL +
		TAB + TAB + '} else {' + NL +
		TAB + TAB + TAB + 'throw new Error(error);' + NL +
		TAB + TAB + '}' + NL +
		TAB + '});' + NL +
		'};' + NL + NL;

	var exportLine =
		'module.exports.getAll = getAll;' + NL +
		'module.exports.find = find;' + NL +
		'module.exports.create = create;' + NL +
		'module.exports.update = update;' + NL +
		'module.exports.remove = remove;' + NL + NL;

	var text = constBlock + listBlock + createBlock +
		readBlock + updateBlock + deleteBlock + exportLine;
	var buf = new Buffer(text);
	fs.write(fd, buf, 0, buf.length, null, cb);
}

function generateService(name, cb) {
	utils.generateDirectory(serviceFolder, function (err) {
		if (err) {
			return cb(err);
		}
		var fileName = serviceFolder + name + 'Service.js';
		utils.createOrClearFile(fileName, function (err, fd) {
			if (err) {
				return cb(err);
			}
			createFileContent(fd, name, name, function (err, data) {
				if (err) {
					return (cb(err));
				}
				fs.close(fd, cb);
			});
		});
	});
}

module.exports = {
	generateService: generateService
};
