const Login = require('../models/LoginModel');


exports.index = (req, res) => {
    if (req.session.user) return res.render('logado');
    return res.render('login');
}


exports.login = async function(req, res) {


        try {
            const login = new Login(req.body);
            await login.login();

            if (login.errors.length > 0) {
                req.flash('errors', login.errors);
                req.session.save(function() {
                    return res.redirect('/');
                });
                return;
            }
            req.flash('success', 'login efetuado com sucesso');
            req.session.user = login.user;
            req.session.save(function() {
                return res.redirect('/logado');
            });

        } catch (e) {

            return res.render('404');
        }

    }
    //sair do login
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');

}

//falta implementar o cadastro aqui
exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);

        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/');
            });
            return;
        }

        req.flash('success', 'cadastro realizado')
        req.session.save(function() {
            return res.redirect('/');
        });

    } catch (e) {
        console.log(e);
        return res.render('404');
    }




}
exports.logado = (req, res) => {
    res.render('logado');
}