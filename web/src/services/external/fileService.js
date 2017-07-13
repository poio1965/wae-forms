const multer = require('multer');
const config = require('config');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, config.get('mediaUrl'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname.replace(new RegExp(',', 'g'), ''));
	}
});

var uploading = multer({
	dest: config.get('mediaUrl'),
	storage : storage,
	onError: (err, next) => {
		console.log('error', err);
		next(err);
	}
});

module.exports.upload = uploading;