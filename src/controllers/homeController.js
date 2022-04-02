const HomeModel = require('../models/HomeModel');

/*HomeModel.create({
        titulo: 'titulo de teste'
    }).then(dados => console.log(dados))
    .catch(e => console.log(e));*/

exports.paginacao = (req, res, next) => {

    res.render('index', {
        titulo: 'esse e o titulo',
        numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
    return;
};

exports.paginaPost = (req, res) => {
    res.send(`ola sou um nova rota de post`);
    return;
};