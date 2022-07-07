const mongoose = require('mongoose');

const PcSchema = new mongoose.Schema({//dados
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
    tombo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    observacao: {
        type: String,
        required: false
    },
    criadoEm: { type: Date, default: Date.now }
});

const PcModel = mongoose.model('equipamento', PcSchema);//conexão no banco

class Pc {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.equipamento = null;
    }
    async register() {// cadastro
        await this.tomboAutomatico();
        this.limpaBody();
        this.validacao();
        await this.tomboExistente();
        await this.create();
    }
    async tomboAutomatico() {//cria tombo 
        let para = false;
        while (para === false) {           
            if (!this.body.tombo) {
                let tombo = (Math.floor(Math.random() * (1001 - 1) + 1)).toString();
                console.log( typeof tombo, tombo)
                this.body.tombo = tombo;
                await this.tomboExistente();
                }
                if (this.errors.length > 0) {
                    para = false;
                }else{
                    para = true;

                }
        }
    }
    async tomboExistente() {//busca tombo se existe e não deixa cadastra
        const tombos = await PcModel.findOne({ tombo: this.body.tombo });
        if (tombos) {
            this.errors.push('tombo já existe');
            return;
        }
    }
    async create() {//cria o equipamento no banco
        if (this.errors.length > 0) {
            return;
        }
        this.equipamento = await PcModel.create(this.body);
    }
    validacao() {// valida os dados
        if (!this.body.telefone) { this.errors.push('telefone é obrigatorio') };
        if (!this.body.unidade) { this.errors.push('unidade é obrigatorio') };
        if (!this.body.responsavel) { this.errors.push('responsavel é obrigatorio') };
        if (!this.body.tipo) { this.errors.push('tipo é obrigatorio') };
    }
    async edit(id) {// edit o equipamento
        if (typeof id !== "string") return;
        this.validacao();
        if (this.errors.length > 0) {
            return
        };
        this.equipamento = await PcModel.findByIdAndUpdate(id, this.body, { new: true });
    }
    static async buscaEquipamentos() {//busca todos
        const equipamentos = await PcModel.find().sort({
            criadoEm: -1
        });
        return equipamentos;
    }

    static async busca(tombo) {// busca pelo tombo
        if (typeof tombo !== "string") return;
        const equipamentos = await PcModel.find({
            tombo: tombo
        }).sort({
            criadoEm: -1
        });
        return equipamentos;
    }

    static async buscaPorId(id) {
        if (typeof id !== "string") return;
        const equipamento = await PcModel.findById(id);
        return equipamento;
    }
    static async buscaListagem(tombo) {//busca um equipamento para lista
        if (typeof tombo !== "string") return;
        const equipamento = await PcModel.findOne({
            tombo: tombo
        });
        return equipamento;
    }
    static async delete(id) {// deleta equipamento
        if (typeof id !== "string") return;
        const equipamento = PcModel.findByIdAndDelete(id);
        return equipamento;
    }
    limpaBody() { // garante que e string
        for (const index in this.body) {
            if (typeof this.body[index] !== 'string') {
                this.body[index] = '';
            }
        }
        this.body = {
            telefone: this.body.telefone,
            unidade: this.body.unidade,
            responsavel: this.body.responsavel,
            tombo: this.body.tombo,
            tipo: this.body.tipo,
            observacao: this.body.observacao
        }

    }
};

module.exports = Pc;