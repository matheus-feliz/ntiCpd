const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes');

app.use(route);

app.use(express.static(path.resolve(__dirname, 'src', 'views', 'include')));
app.use(express.static(path.resolve(__dirname, 'src', 'views')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('acesse http://localhost:3000');
});