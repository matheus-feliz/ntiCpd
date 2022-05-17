const mongoose = require('mongoose');
const valida = require('validator');

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

    async register() {
        this.validacao();
        this.userExistem();

        if (this.errors.length > 0) {

            return;
        }


        try {

            if (this.errors.length === 0) this.user = await LoginModel.create(this.body);



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
        if (user) this.errors.splice(1, 0, 'outro usuario já usa esse email');
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