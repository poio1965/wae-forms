// node imports
const JwtStrategy = require('passport-jwt').Strategy;
 
// app imports
const user = require('../src/models/user').schema;
const config = require('config'); 
 
module.exports = function(passport) {
	var opts = {};
	opts.secretOrKey = config.get('crypt.cryptSalt');
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		user.findOne({id: jwt_payload.id}, (err, user) => {
			if (err) {
				return done(err, false);
			}
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};