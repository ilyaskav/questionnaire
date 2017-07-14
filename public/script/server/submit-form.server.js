var app = require('../../../app.js');
var util = require('util');
var fileIO = require( './file-io.server.js');


module.exports = (req, res, next ) => {

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

        fileIO.writeObj(req.body, 'db.txt').then(
            function (result) { // успех
                res.json({ result: result });
            },
            function (reason) { // отказ
                next(reason);
            }
        );
    });
}

