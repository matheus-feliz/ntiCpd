exports.meuMiddleware = (req, res, next) => {
    res.locals.umaVariavelLocal = 'este é o valor local';
    next();
}

exports.checkCrsError = (err, req, res, next) => {
    if (err && 'EBADCSRFTOKEN' === err.code) {
        return res.render('404');
    }
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();

}