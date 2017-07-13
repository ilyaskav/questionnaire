var express = require('express');
var app = module.exports = express();

require('./config/routes.js')(app);

var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);