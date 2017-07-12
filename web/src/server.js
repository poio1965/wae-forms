// node imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport	= require('passport');
var compression = require('compression');
// app imports
const config =  require('config');
var path = require('path');

if(config.has('logEntriesToken')){
	console.log('loading logentries');
	require('console.logentries')(config.get('logEntriesToken'), true);
} else {
	require('console.logentries')();
}

//const authenticationService = require('./services/authenticationService');
const PORT = process.env.PORT || 3000;

var app = express();
app.use(compression());
var server;

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '200kb'}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../dist')));
//app.use('/api', require('./auth_routes'));

app.use('/api', require('./routes'));

// if(config.get('authentication')){
// 	app.use('/api', authenticationService, require('./routes'));
// } else {
// 	app.use('/api', require('./routes'));
// }
app.all('*', (req, res) => {
//   console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server = app.listen(PORT, () => {
	console.log('Server listening on port %d!', PORT);
	connectMongo();

}).on('error',(e) => {
	console.log('******** ERROR ********');
	console.log('It was an error when trying to connect :(');	

	if (e.code == 'EADDRINUSE') {
		var message = 'The port %d is in use.\n' +
			'Try closing nodejs proccess and starting again';
		console.log(message, PORT);	

		server.close();

	} 

	console.log('Error message -> %s', e.message);
});

var connectMongo = function(){
	mongoose.connect(config.get('database'), { useMongoClient: true }).
	then(function(){
		console.log('Connected correctly to MongoDB: %s\n', config.get('database'));
	}).catch(err => {
		console.log(err);
		throw new Error(err);
	});

	mongoose.set('debug', config.get('mongooseDebug'));
};


module.exports.app = app;


