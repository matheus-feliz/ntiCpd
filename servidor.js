require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes');
const mongoose = require('mongoose');
const helmet = require('helmet');
const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { meuMiddleware, csrfMiddleware } = require('./src/middleware/middleware');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



mongoose.connect(process.env.CONNECTSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('conectado a base de dados');
        app.emit('pronto');
    }).catch(e => console.log(e));

const sessionOpition = session({
    secret: 'dljalçkdjaçkldjalkjdçaljlçaipoipçlçkh',
    store: new MongoStore({ mongoUrl: process.env.CONNECTSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOpition);
app.use(flash());

app.use(csrf());
//middleware
app.use(meuMiddleware);
app.use(csrfMiddleware);
//static
app.use(express.static(path.resolve(__dirname, 'src', 'views')));
app.use(express.static(path.resolve(__dirname, 'src', 'views', 'include')));
app.use(express.static(path.resolve(__dirname, 'src', 'views', 'include', 'img')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
//
app.use(route);






app.listen(3000, () => {
    console.log('acesse http://localhost:3000');
});