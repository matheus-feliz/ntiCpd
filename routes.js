const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');
const computador = require('./src/controllers/computadorController');
const unidade = require('./src/controllers/unidadeController');
const relatorio = require('./src/controllers/relatorioController');
const { loginReq } = require('./src/middleware/middleware');

//pagina de login
route.get('/', loginController.index);
route.post('/cadastro', loginController.register);
route.post('/login', loginController.login);
route.get('/logout', loginController.logout);
route.get('/logado', loginController.logado);
route.get('/esqueceusenha', loginController.esqueceuSenha);
route.post('/esqueceu', loginController.esqueceu);
route.post('/registersenha/edit/:id', loginController.senhaEdit);

//pagina de equipamento
route.get('/cadastrocomputador', loginReq, computador.indexCadastro);
route.post('/registro', loginReq, computador.cadastro);
route.get('/cadastrocomputador/edit/:id', computador.indexEdit);
route.post('/register/edit/:id', loginReq, computador.editEquipamentoPost);
route.get('/cadastrocomputador/delete/:id', loginReq, computador.delete);
route.get('/buscacomputador', loginReq, computador.busca);
route.post('/buscacomputadorBanco', loginReq, computador.buscaRetorno);

//pagina de servico com equipamento
route.get('/listagemcomputador/:id', loginReq, computador.listagem);
route.get('/cadastrodeequipamento/:id', loginReq, computador.cadastroDeServico);
route.post('/registro/servico', loginReq, computador.cadastroDeServicoPost);
route.get('/cadastrodeequipamento/edit/:id', loginReq, computador.editServico);
route.post('/registro/edit/servico/:id', loginReq, computador.editServicoCadastro);
route.get('/listagemcomputador/delete/:id', loginReq, computador.deleteServicoUm);

//impressao
route.get('/impressao/:id', loginReq, computador.impressao);
route.get('/impressaounidade/:id', loginReq, unidade.impressao);

//pagina de Unidade
route.get('/cadastrounidade', loginReq, unidade.indexCadastro);
route.post('/registrounidade', loginReq, unidade.cadastro);
route.get('/cadastrounidade/edit/:id', loginReq, unidade.indexEdit);
route.post('/registrounidade/edit/:id', loginReq, unidade.edit);
route.get('/cadastrounidade/delete/:id', loginReq, unidade.delete);
route.get('/buscaunidade', loginReq, unidade.busca);
route.post('/buscaunidadeBanco', loginReq, unidade.buscaRetorno);

//pagina de servico sem equipamento
route.get('/listagemunidade/:id', loginReq, unidade.listagem);
route.get('/cadastrodeservico/:id', loginReq, unidade.cadastroDeServico);
route.post('/registro/servicoUnidade', loginReq, unidade.cadastroDeServicoPost);
route.get('/cadastrodeservico/edit/:id', loginReq, unidade.editServico);
route.post('/registro/edit/servicoUnidade/:id', loginReq, unidade.editServicoCadastro);
route.get('/listagemunidade/delete/:id', loginReq, unidade.deleteServicoUm);



//pagina de relatorio
route.get('/relatorio', loginReq, relatorio.relatorio);
route.post('/relatorioBanco', loginReq, relatorio.relatorioBanco);
module.exports = route;