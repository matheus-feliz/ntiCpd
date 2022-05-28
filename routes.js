const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');
const computador = require('./src/controllers/computadorController');
const unidade = require('./src/controllers/unidadeController');
const relatorio = require('./src/controllers/relatorioController');


//pagina de home
route.get('/', loginController.index);
route.post('/cadastro', loginController.register);
route.post('/login', loginController.login);
route.get('/logout', loginController.logout);
route.get('/logado', loginController.logado);

//pagina de equipamento
route.get('/cadastrocomputador', computador.indexCadastro);
route.post('/registro', computador.cadastro);
route.get('/buscacomputador', computador.busca);
route.get('/listagemcomputador', computador.listagem);
route.get('/cadastrodeequipamento', computador.cadastroDeServico);

//pagina de Unidade
route.get('/cadastrounidade', unidade.cadastro);
route.get('/buscaunidade', unidade.busca);
route.get('/listagemunidade', unidade.listagem);
route.get('/cadastrodeservico', unidade.cadastroDeServico);

//pagina de relatorio
route.get('/relatorio', relatorio.relatorio);
module.exports = route;