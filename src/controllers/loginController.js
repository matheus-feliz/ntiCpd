const res = require("express/lib/response");

exports.index = (req, res) => {
    res.render('login');
}

exports.logado = (req, res) => {
    res.render('logado');
}