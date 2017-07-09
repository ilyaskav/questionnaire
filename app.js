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
var mongoose = require('mongoose');
var Hashids = require('hashids');
var hashids = new Hashids();

var Code = require(lib + '/code-model.server.js');
var Organization = require(lib + '/organization-model.server.js');
var connecton = mongoose.connect('mongodb://localhost/test');

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
  let limit = parseInt(req.query.length) || 10;
  let skip = parseInt(req.query.start);
  let draw = parseInt(req.query.draw);

  Code.aggregate([{
    $match: { organizations: '59624794a89fbf21bcfd2f0d', status: 'marked' }
  },
  {
    $group: { _id: null, count: { $sum: 1 }, codes: { $push: '$$ROOT' } }
  },
  {
    $project: {
      codes: { $slice: ['$codes', [skip, limit]] },
      _id: 0,
      count: 1
    }
  }],
    function (err, data) {
      if (err) throw err;

      var data = {
        data: data
      };

      data.draw = draw;
      res.json(data);
    });

});

app.post('/addCode', function (req, res) {
  function getRandomIntInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive 
  }

  let randomCode = 0;
  let users = ['Ilya', 'Olga', 'John', 'Jack', 'Jill', 'Nick', 'Esh', 'Bill', 'Max', 'Marks', 'Colin', 'Thom', 'Kevin', 'Kate'];
  let statuses = ['marked', 'reserved', 'used'];
  let organizations = [];

  Organization.find({}, function (err, data) {
    if (err) throw err;

    organizations = data;

    for (let i = 0; i < 20000; i++) {
      randomCode = getRandomIntInt(1000, 99999);

      var newCode = new Code({
        code: randomCode,
        hashedCode: hashids.encode(randomCode),
        fullUserData: {
          name: users[getRandomIntInt(0, users.length)],
          campaing: 'Grand openning'
        },
        status: statuses[getRandomIntInt(0, statuses.length)],
        organizations: organizations[getRandomIntInt(0, organizations.length)].id
      });

      newCode.save(function (err) {
        if (err) console.error(err);
        // console.log('code is saved');
      });
    }

    res.json({ result: "codes has been added" });
  });

});

app.post('/addOrg', function (req, res) {
  var newOrg = new Organization({
    name: 'SOHO'
  });

  newOrg.save(function (err) {
    if (err) console.error(err);

    console.log('org is saved');
    res.json({ result: "org has been added" });
  })
});

var port = 8080;
app.listen(port);
console.log('Listening on port: ' + port);