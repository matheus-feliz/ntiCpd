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
//pagina de servico com equipamento
route.get('/listagemcomputador/:id', computador.listagem);
route.get('/cadastrodeequipamento/:id', computador.cadastroDeServico);
route.post('/registro/servico', computador.cadastroDeServicoPost);
route.get('/cadastrodeequipamento/edit/:id', computador.editServico);
route.post('/registro/edit/servico/:id', computador.editServicoCadastro);
route.get('/listagemcomputador/delete/:id', computador.deleteServicoUm);

//impressao
route.get('/impressao/:id', computador.impressao);
route.get('/impressaoUnidade/:id', unidade.impressao);

//pagina de Unidade
route.get('/cadastrounidade', unidade.indexCadastro);
route.post('/registrounidade', unidade.cadastro);
route.get('/cadastrounidade/edit/:id', unidade.indexEdit);
route.post('/registrounidade/edit/:id', unidade.edit);
route.get('/cadastrounidade/delete/:id', unidade.delete);
route.get('/buscaunidade', unidade.busca);
//pagina de servico sem equipamento
route.get('/listagemunidade/:id', unidade.listagem);
route.get('/cadastrodeservico/:id', unidade.cadastroDeServico);
route.post('/registro/servicoUnidade', unidade.cadastroDeServicoPost);
route.get('/cadastrodeservico/edit/:id', unidade.editServico);
route.post('/registro/edit/servicoUnidade/:id', unidade.editServicoCadastro);
route.get('/listagemunidade/delete/:id', unidade.deleteServicoUm);



//pagina de relatorio
route.get('/relatorio', relatorio.relatorio);
module.exports = route;