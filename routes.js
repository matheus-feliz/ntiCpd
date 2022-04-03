const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');


//pagina de home
route.get('/', loginController.index);

//pagina de logado
route.get('/logado', loginController.logado);

module.exports = route;