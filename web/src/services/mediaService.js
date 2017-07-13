// node imports
const fs = require('fs');
const config = require('config');
var mime = require('mime');
var pump = require('pump');
// app imports

const repository = require('../repositories/mediaRepository');
const utils = require('../utils/utils');
const four0four = require('../utils/404')();

var getAll = function (req, res, next) {
	
	
	repository.getAll(req.requestData).then((response) => {
		res.json(response);
	}).catch((error) => {
		throw new Error(error);
	});
};

var create = function (req, res, next) {
	
	repository.create(req.requestData).then((response) => {
		res.header('Location', response._id);
		res.json(response);
	}).catch((error) => {
		throw new Error(error);
	});
};

var find = function (req, res, next) {
	
	repository.find(req.requestData).then((response) => {
		res.json(response);
	}).catch((error) => {
		if (error.type !== null && error.type === 'notFound') {
			four0four.send404(req, res, error.message);
		} else {
			throw new Error(error);
		}
	});
};

var update = function (req, res, next) {
	
	repository.update(req.params.id, req.requestData, req.requestData.updateData).then((response) => {
		res.json(response);
	}).catch((error) => {
		if (error.type !== null && error.type === 'notFound') {
			four0four.send404(req, res, error.message);
		} else {
			throw new Error(error);
		}
	});
};

var remove = function (req, res, next) {
	if(req.requestData.params.id === undefined){
		req.requestData.params.id = req.params.id;
	}
	repository.find(req.requestData).then(model => {
		
		fs.unlink(model._doc.url, 
			function (err) {
				if (err) {
					console.error(err);
				}else{
					console.log('File ' + model._doc.name + ' deleted successfully!');
				}
				repository.remove(req.params.id).then((response) => {
					res.json(response);
				}).catch((error) => {
					if (error.type !== null && error.type === 'notFound') {
						four0four.send404(req, res, error.message);
					} else {
						throw new Error(error);
					}
				});
			});
	});	
};

var createMediaFile = function (req, res, next) {
	var media = {};
	var file = req.file;
	media.name = file.originalname.replace(new RegExp(',', 'g'), '');
	media.type = file.mimetype;
	media.registered = new Date();
	media.url = file.path;

	req.requestData.params = media;
	repository.create(req.requestData).then((response) => {
		res.json(response);
	}).catch((error) => {
		throw new Error(error);
	});
	//res.json(media);
};

var createUnattachedMediaFile = function (req, res, next) {
	var media = {};
	var file = req.file;
	media.name = file.originalname.replace(new RegExp(',', 'g'), '');
	media.type = file.mimetype;
	media.registered = new Date();
	media.url = file.path;
	media.unattachedResource = true;

	req.requestData.params = media;
	repository.create(req.requestData).then((response) => {
		res.json(response);
	}).catch((error) => {
		throw new Error(error);
	});
	//res.json(media);
};

var createMediaFromFile = function (req, cb) {
	
	var file = req.file;
	var media = {};
	media.name = file.originalname;
	media.type = file.mimetype;
	media.registered = new Date();
	media.url = file.path;

	req.requestData.params = media;
	repository.create(req.requestData).then((response) => {
		if (cb) {
			cb(response);
		}
	}).catch((error) => {
		throw new Error(error);
	});
};

var deleteGhostFiles = function () {

	console.log('Deleting ghost files');

	var mediaUrl = config.get('mediaUrl');

	fs.readdir(mediaUrl, (err, files) => {
		if (files == null) {
			return;
		}
		files.forEach(file => {

			repository.existsByParams({ url: mediaUrl + file }).then((response) => {
				if (response === false) {
					fs.stat(mediaUrl + file, function (err, stat) {
						if (!stat.isDirectory()) {
							fs.unlink(mediaUrl + file, function (err) {
								if (err) {
									return console.error(err);
								}
								console.log('File ' + file + ' deleted successfully!');
							});
						}
					});
				}
			}).catch((error) => {
				throw new Error(error);
			});
		});
	});
};

var streamMediaFile = function (req, res, next) {

	var mediaId = req.params.id;
	req.requestData.params.id = mediaId;

	repository.find(req.requestData).then((response) => {
		var exists = fs.existsSync(response.url);

		if (!exists) {
			console.warn('Media not found: ' + req.params.id);
			four0four.send404(req, res);
			return;
		}

		//console.log('media: ' + response._doc.name);
		var stat = fs.statSync(response.url);

		res.writeHead(200, {
			'Content-Disposition': 'attachment;filename=' + response.name,
			'Content-Type': response.type,
			'Content-Length': stat.size
		});

		var readStream = fs.createReadStream(response.url);
		pump(readStream, res, function(err) {
			if(err && err.message === 'premature close'){
				console.log('pipe finished', err.message);
			} else if(err) {
				console.log('pipe finished', err);
			}
		});
	}).catch((error) => {
		if (error.type !== null && error.type === 'notFound') {
			four0four.send404(req, res, error.message);
		} else {
			throw new Error(error);
		}
	});

};

var getMediaType = function (extension) {
	return mime.lookup(extension);
};

var mediaToMediaId = function (mediaList) {

	if (typeof mediaList === 'undefined' || mediaList === null) {
		return;
	}

	var mediaIdList = [];

	if (Array.isArray(mediaList)) {
		mediaList.forEach(media => {
			mediaIdList.push(media._id);
		});
		mediaList = mediaIdList;
	} else {
		mediaList = mediaList._id;
	}

};

var saveFile = function (req, res, next) {
	var mediaId = req.params.id;
	var file = req.file;

	req.requestData.params.id = mediaId;
	console.log('Saving: media file: ' + mediaId);
	repository.find(req.requestData).then((media) => {

		media.url = file.path;
		
		repository.update(mediaId, req.requestData, media).then(() => {
			res.json('saved');
		}).catch((error) => {
			console.log('Error saveFile in update: ' + error + ' - ' + JSON.stringify(error) + '\n' + error.stack);
			//res.status(500).end();
			res.json('saved');
		});

	}).catch((error) => {
		console.log('Error saveFile in find: ' + error + ' - ' + JSON.stringify(error) + '\n' + error.stack);
		//res.status(500).end();
		res.json('saved');
	});

};

module.exports.getAll = getAll;
module.exports.find = find;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.createMediaFile = createMediaFile;
module.exports.createUnattachedMediaFile = createUnattachedMediaFile;
module.exports.deleteGhostFiles = deleteGhostFiles;
module.exports.streamMediaFile = streamMediaFile;
module.exports.getMediaType = getMediaType;
module.exports.mediaToMediaId = mediaToMediaId;
module.exports.createMediaFromFile = createMediaFromFile;
module.exports.saveFile = saveFile;

