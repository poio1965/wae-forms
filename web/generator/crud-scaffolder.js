'use strict';

var serviceGenerator = require('./service-generator');
var repositoryGenerator = require('./repository-generator');

const path = require('path');
const modelFolder = '../src/models/';
const servicesFolder = '../src/services/';
const repositoryFolder = '../src/repositories/';
const fs = require('fs');

fs.readdir(modelFolder, (err, files) => {
	files.forEach(file => {
		// Take the first arg as model name
		var modelName = path.basename(file, '.js');

		generateServices(modelName);
		generateRepositories(modelName);

	});
});


function generateServices(modelName) {

	var existsService = false;
	fs.readdir(servicesFolder, (err, serviceFiles) => {
		serviceFiles.every(serviceFile => {
			var serviceName = path.basename(serviceFile, '.js').replace('Service', '');
			if (serviceName === modelName) {
				existsService = true;
				return false;
			}

			return true;
		});

		if (!existsService) {
			console.log('Generating service for: ' + modelName);
			serviceGenerator.generateService(modelName, function (err) {
				if (err) {
					console.log('There was a problem generating the controller file.');
				}
				console.log('Generated controller for: ' + modelName);
			});
		}

	});
}

function generateRepositories(modelName) {
	var existsRepository = false;

	fs.readdir(repositoryFolder, (err, repositoryFiles) => {

		repositoryFiles.every(repositoryFile => {
			var repositoryName = path.basename(repositoryFile, '.js').replace('Repository', '');
			if (repositoryName === modelName) {
				existsRepository = true;
				return false;
			}

			return true;
		});

		if (!existsRepository) {
			console.log('Generating repository for: ' + modelName);
			repositoryGenerator.generateRepository(modelName, function (err) {
				if (err) {
					console.log('There was a problem generating the repository file.');
				}
				console.log('Generated repository for:' + modelName);
			});
		}
	});

}

