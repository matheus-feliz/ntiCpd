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
route.get('/cadastrocomputador/edit/:id', computador.indexEdit);
route.post('/register/edit/:id', computador.edit);
route.get('/cadastrocomputador/delete/:id', computador.delete);
route.get('/buscacomputador', computador.busca);
route.get('/listagemcomputador/:id', computador.listagem);
route.get('/cadastrodeequipamento/:id', computador.cadastroDeServico);
route.post('/registro/servico', computador.cadastroDeServicoPost);
route.get('/cadastrodeequipamento/edit/:id', computador.editServico);
route.post('/registro/edit/servico/:id', computador.editServicoCadastro);
route.get('/listagemcomputador/delete/:id', computador.deleteServicoUm);



//impressao
route.get('/impressao/:id', computador.impressao);

//pagina de Unidade
route.get('/cadastrounidade', unidade.cadastro);
route.get('/buscaunidade', unidade.busca);
route.get('/listagemunidade', unidade.listagem);
route.get('/cadastrodeservico', unidade.cadastroDeServico);

//pagina de relatorio
route.get('/relatorio', relatorio.relatorio);
module.exports = route;