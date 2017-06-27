var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
//var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (request, response) {
  var locals = {
    title: 'Page Title'
  };
  response.render('index', locals);
});

var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);