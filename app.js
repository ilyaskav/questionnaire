var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require('util');
var moment = require('moment');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), 'public/script/server');
var fileIO = require(lib + '/file-io.server.js');

var app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares! 
app.use(express.static('public'));

app.get('/', function (request, response) {
  response.render('index', { title: 'Brandply questionnaire' });
});

app.get('/form', function (request, response) {
  response.render('form', { title: 'Brandply questionnaire: answer the questions' });
});

app.post('/submitForm', function (req, res) {

  req.checkBody('codeQuality', 'Invalid code quality value').notEmpty().isInt();
  req.checkBody('suggestions', 'Suggestions should not be empty').notEmpty();
  req.checkBody('lengthOfSprint', 'Invalid length Of Sprint value').notEmpty().isInt();
  req.checkBody('name', 'Name is required').notEmpty();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
      return;
    }

    req.body.date = new Date();

    fileIO.writeObj(req.body).then(
      function (result) {
        res.json({ result: result });
      },
      function (result) {
        res.status(400).send(result);
      }
    );
  });
});

app.get('/results', function (req, res) {

  fileIO.readObj().then(
    function (data) {  // успех

      data.forEach(function (item, i, data) {
        item.date = moment(item.date).format('MMMM Do YYYY, h:mm:ss a');
      });

      var locals = {
        title: 'Brandply questionnaire: results',
        data: data,
        error: data.length ? null : "No questionnaire answers yet."
      }
      res.render('results', locals);
    },
    function (reason) { // отказ  
      res.render('results', { title: 'Brandply questionnaire: results', data: [], error: "No questionnaire answers yet." });
    });
});

app.get('/datatables', function (req, res) {
  res.render('datatables', { title: 'Datatables' });
});

app.get('/getData', function (req, res) {
  var data = {
    "data": [
      {
        "user": "ilya",
        "email": "ilya@gmail.com"
      },
      {
        "user": "Olya",
        "email": "olya@gmail.com"
      }]
  };

  res.json(data);
});

var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);