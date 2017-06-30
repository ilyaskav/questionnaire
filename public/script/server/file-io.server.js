var fs = require('fs');

var writeAnswer = function (data) {
  var promise = new Promise(function (resolve, reject) {
    
    fs.open('public/data/db.txt', 'a', (err, fd) => {
      if (err) {
        reject("can't open the file");
        return;
      }
      fs.appendFile(fd, JSON.stringify(data, null) + '`', (err) => {
        if (err) {
          reject("can't append to a file");
        }
        fs.close(fd);
        resolve('The data was appended to file!');
      });
    });
  });
  return promise;
};

var readAnswers = function () {
  var promise = new Promise(function (resolve, reject) {

    fs.open('public/data/db.txt', 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          reject('file does not exists');
        }
        return;
      }
      fs.readFile(fd, (err, data) => {
        if (err) throw err;

        fs.close(fd);
        var resultArr = [];

        var strArray = data.toString().split('`');

        for (var i = 0; i < strArray.length; i++) {
          if (!strArray[i]) continue;
          resultArr.push(JSON.parse(strArray[i]));
        }
        resolve(resultArr);
      });
    });
  });
  return promise;
};

module.exports = {
  writeObj: writeAnswer,
  readObj: readAnswers
}