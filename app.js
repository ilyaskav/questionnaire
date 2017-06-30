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
    res.json({
      urlparam: req.params.urlparam,
      getparam: req.query.getparam,
      postparam: req.body.postparam
    });
  });
});

app.get('/results', function (req, res) {

   readAnswers().then(function(data){
    res.render('results', {title: 'Brandply questionnaire: results', data: data});
   }); 
});

var writeAnswer = function (data) {
  fs.open('public/data/db.txt', 'a', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('myfile already exists');
        return;
      }
      throw err;
    }
    fs.appendFile(fd, JSON.stringify(data, null)+ '`', (err) => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
      fs.close(fd);
    });
  });
};

var readAnswers = function () {
  var promise = new Promise(function (resolve, reject) {

    fs.open('public/data/db.txt', 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          reject('file does not exists');
        }
        throw err;
      }
      fs.readFile(fd, (err, data) => {
        if (err) throw err;

        // console.log(data);
        fs.close(fd);
        var resultArr = [];

        var strArray = data.toString().split('`');
        console.log(strArray);

        for (var i=0; i<strArray.length; i++){
          if (!strArray[i]) continue;
          resultArr.push(JSON.parse(strArray[i]));
        }
        // var strArrayJSON = JSON.parse(strArray);
        console.log(resultArr);
        resolve(resultArr);
      });
    });
  });
return promise;
};


var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);