const mongoose = require('mongoose');
const valida = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    password2: {
        type: String,
        required: true

    }

});


const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {


        //se o email for valido compara com o banco
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('usuário não existe')
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('senha invalida');
            this.user = null;
            return;
        }

    }
    async register() {
        this.validacao();
        this.userExistem();
        try {

            if (this.errors.length > 0) {
                console.log('error 1');
                return;
            }


            const salt = bcryptjs.genSaltSync();
            this.body.password = bcryptjs.hashSync(this.body.password, salt);
            this.body.password2 = bcryptjs.hashSync(this.body.password2, salt);


            this.user = await LoginModel.create(this.body);



        } catch (e) {
            console.log(e);
        }

    }
    validacao() {
        //garente o tipo string
        this.limpaBody();
        //valida email
        if (!valida.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        //valida se a senha é iqual
        if (this.body.password !== this.body.password2) this.errors.push('senha não são iquais');
    }

    async userExistem() {
        const user = await LoginModel.findOne({ email: this.body.email });
        if (user) {
            this.errors.splice(1, 0, 'outro usuario já usa esse email');
            return;
        }
    }

    limpaBody() {
        for (const index in this.body) {
            if (typeof this.body[index] !== 'string') {
                this.body[index] = '';
            }
        }
        this.body = {
            nome: this.body.nome,
            email: this.body.email,
            password: this.body.password,
            password2: this.body.password2
        }

    }

};

module.exports = Login;