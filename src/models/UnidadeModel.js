const mongoose = require('mongoose');

const UnidadeSchema = new mongoose.Schema({//dados
    telefone: {
        type: String,
        required: true
    },
    unidade: {
        type: String,
        required: true
    },
    responsavel: {
        type: String,
        required: true
    },
    criadoEm: { type: Date, default: Date.now }
});

const UnidadeModel = mongoose.model('unidade', UnidadeSchema);//conexão com o banco

class Unidade {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.unidade = null;
    }

    async register() {//cadastro
        this.limpaBody();
        this.validacao();
        await this.unidadeExistente();
        if (this.errors.length > 0) {
            return;
        }       
        await this.create();
    }
    async unidadeExistente() {//checa se existe uma unidade
        const unidade = await UnidadeModel.findOne({ unidade: this.body.unidade });
        if (unidade) {
            this.errors.push('unidade já existe');
        }
    }
    static async buscaUnidades(){//busca de todas unidade
        const unidades = await UnidadeModel.find().sort({criadoEm: -1});
        return unidades;
    }
    static async busca(unidade) {//busca
        if (typeof unidade !== "string") return;
        const unidades = await UnidadeModel.find({
            unidade: unidade
        }).sort({
            criadoEm: -1
        });
        return unidades;
    }

    static async buscaId(id){// busca por id
        if(typeof id !== "string") return;
        const unidade = await UnidadeModel.findById(id);
        return unidade;
    }

    static async buscaListagem(unidade) {// busca listagem
        if(typeof unidade !== "string") return;
            const unidadeID = await UnidadeModel.findOne({
            unidade: unidade
        });
        return unidadeID;
    }

    async edit(id){//edit de dados
        if(typeof id !== "string") return;
        this.validacao();
        if(this.errors.length>0){
            return;
        }
        this.unidade = await UnidadeModel.findByIdAndUpdate(id, this.body, { new: true })
    }
    static async delete(id) {//deleta um dado
        if (typeof id !== "string") return;
        const unidade = UnidadeModel.findByIdAndDelete(id);
        return unidade;
    }
    validacao() {//valida os dados
        if (!this.body.telefone) { this.errors.push('telefone é obrigatorio') };
        if (!this.body.unidade) { this.errors.push('unidade é obrigatorio') };
        if (!this.body.responsavel) { this.errors.push('responsavel é obrigatorio') };
    }

    limpaBody() {// garante que é uma string
        for (const index in this.body) {
            if (typeof this.body[index] !== 'string') {
                this.body[index] = '';
            }
        }
        this.body = {
            telefone: this.body.telefone,
            unidade: this.body.unidade,
            responsavel: this.body.responsavel
        }

    }

    async create() {//registra no banco de dados
        this.unidade = await UnidadeModel.create(this.body);
    }

}

module.exports = Unidade;