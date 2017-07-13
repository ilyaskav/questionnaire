
module.exports = function ajaxHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: err });
    } 

    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('err/500', { title: 'Error occured during your request', error: err });
}