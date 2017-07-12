'use strict';

var fs = require('fs');
var utils = require('./utils');
var repositoryFolder = '../src//repositories/';
// writes down schema content.
function createFileContent(fd, name, pluralName, cb) {
	// Const
	var TAB = '\t';
	var NL = '\r\n';

	var constBlock =
		'const model = require(\'../models/' + name + '\').model;' + NL +
		'const genericRepository = require(\'../repositories/genericRepository\');' + NL + NL;

	var repositoryBlock =
		'var ' + name + 'Repository = function() {' + NL +
		TAB + 'var ' + name + 'Repository = genericRepository(model);' + NL +
		TAB + 'return ' + name + 'Repository;' + NL +
		'};' + NL + NL;

	var exportLine = 'module.exports = ' + name + 'Repository();' + NL + NL;

	var text = constBlock + repositoryBlock + exportLine;
	var buf = new Buffer(text);
	fs.write(fd, buf, 0, buf.length, null, cb);
}

function generateRepository(name, cb) {
	utils.generateDirectory(repositoryFolder, function (err) {
		if (err) {
			return cb(err);
		}
		var fileName = repositoryFolder + name + 'Repository.js';
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
	generateRepository: generateRepository
};
