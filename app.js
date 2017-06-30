var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require('util');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), 'public/script/server');
var fileIO = require(lib + '/file-io.server.js');

var app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares! 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (request, response) {
  var locals = {
    title: 'Brandply questionnaire'
  };
  response.render('index', locals);
});

app.get('/form', function (request, response) {
  var locals = {
    title: 'Brandply questionnaire: answer the questions'
  };
  response.render('form', locals);
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

    fileIO.writeObj(req.body).then(
      function (result) {
        res.json({result: result});
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
      res.render('results', { title: 'Brandply questionnaire: results', data: data, error: null });
    },
    function (reason) { // отказ  
      res.render('results', { title: 'Brandply questionnaire: results', data: [], error: "No questionnaire answers yet." });
    });
});


var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);