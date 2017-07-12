'use strict';
const server = require('./src/server');
const startup = require('./src/startup');

//const authenticationService = require('./app/services/authenticationService');

console.log('Initializing waeForms [' + process.env.NODE_ENV.toUpperCase() + ']');

//server.app.use('/auth', require('./app/auth_routes'));
//server.app.use('/', authenticationService, require('./app/routes'));