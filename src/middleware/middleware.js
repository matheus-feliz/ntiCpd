exports.meuMiddleware = (req, res, next) => {//variavel global
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.csrfMiddleware = (req, res, next) => {//tokens
    res.locals.csrfToken = req.csrfToken();
    next();

}

exports.loginReq = (req, res, next) => {//teste de login
    if (!req.session.user) {
        req.flash('errors', 'você precisa está logado');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
}