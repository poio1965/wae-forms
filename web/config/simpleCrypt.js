
// node imports
const simplecrypt = require('simplecrypt');

// app imports
const config = require('config');

var params = {
	salt: config.get('crypt.cryptSalt'),
	password: config.get('crypt.cryptPassword')
};
			
var sc = simplecrypt(params);

sc.compare = function(data, encrypted, cb){
	var dataEncrypted = sc.encrypt(data);
	if (dataEncrypted === encrypted){
		cb(null, true);
	} else {
		cb('does not match', false);
	}
};

sc.compareEncrypted = function(dataEncrypted, encrypted, cb){
	if (dataEncrypted === encrypted){
		cb(null, true);
	} else {
		cb('does not match', false);
	}
};

module.exports = sc;