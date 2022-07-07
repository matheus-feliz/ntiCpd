
const Login = require('../models/LoginModel');

exports.index = (req, res) => {//incio da tela de login
    if (req.session.user) return res.render('logado');
    return res.render('login');
}


exports.login = async function (req, res) {//faz login
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/');
            });
            return;
        }
        req.flash('success', 'login efetuado com sucesso');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/logado');
        });
    } catch (e) {
        return res.render('404');
    }

}
//sair do login
exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');

}

//falta implementar o cadastro aqui
exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);

        await login.register();
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/');
            });
            return;
        }

        req.flash('success', 'cadastro realizado')
        req.session.save(function () {
            return res.redirect('/');
        });

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}
exports.logado = (req, res) => {//pagina de inicio pós login
    res.render('logado');
}

exports.esqueceuSenha = (req, res) => {//esqueceu senha
    res.render('esqueceuSenha', { senha: {} });
}

exports.esqueceu = async function (req, res) {//busca pelo id
    if (typeof req.body.email !== 'string') return;
    const user = new Login(req.body);
    const senha = await user.esqueceuSenha();

    if (user.errors.length > 0) {
        req.flash('errors', user.errors);
        req.session.save(function () {
            return res.redirect('/esqueceusenha');
        });
        return;
    }
    res.render('esqueceuSenha', { senha });
}
exports.senhaEdit = async function (req, res) {//update da senha
    if (!req.params.id) res.render('404');
    const user = new Login(req.body);
   await user.edit(req.params.id);
    if (user.errors.length > 0) {
        req.flash('errors', user.errors);
        req.session.save(async function () {
           res.redirect(`/esqueceusenha`)
            return;
        });
        return;
    }
    req.flash('success', 'edição efetuado com sucesso');
    req.session.save(function () {
        res.redirect(`/`);
        return;
    })
}
