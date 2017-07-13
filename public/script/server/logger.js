var fileIO = require('./file-io.server.js');


module.exports = function logger(req, res, next) {
    let ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];

    fileIO.writeObj({
        datetime : new Date(),
        ip: ip,
        method: req.method,
        url: req.url
    }, 'log.txt', '\r');

    next();
}