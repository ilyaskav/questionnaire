var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require('util');
var fs = require('fs');

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
  req.checkBody('bestDev', 'Invalid best dev value').notEmpty().isInt();
  req.checkBody('suggestions', 'Suggestions should not be empty').notEmpty();
  req.checkBody('lengthOfSprint', 'Invalid length Of Sprint value').notEmpty().isInt();
  req.checkBody('name', 'Name is required').notEmpty();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
      return;
    }
    // res.json({
    //   urlparam: req.params.urlparam,
    //   getparam: req.query.getparam,
    //   postparam: req.body.postparam
    // });
    writeAnswer(req.body);
  });
});

app.get('/results', function (req, res) {
  var locals = {
    title: 'Brandply questionnaire: results'
  };
  res.render('results', locals);
});

var writeAnswer = function (data) {
  fs.open('../data/db.txt', 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('myfile already exists');
        return;
      }
      throw err;
    }
    writeMyData(JSON.stringify(fd));
  });
};

var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);