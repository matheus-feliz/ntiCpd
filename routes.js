const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');
const computador = require('./src/controllers/computadorController')


//pagina de home
route.get('/', loginController.index);

//pagina de logado
route.get('/logado', loginController.logado);

//pagina de cadastro
route.get('/cadastrocomputador', computador.cadastro);
route.get('/buscacomputador', computador.busca);
route.get('/listagemcomputador', computador.listagem);
route.get('/cadastrodeequipamento', computador.cadastroDePc);

module.exports = route;