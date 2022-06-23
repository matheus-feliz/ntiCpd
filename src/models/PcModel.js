const mongoose = require('mongoose');

const PcSchema = new mongoose.Schema({
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

const PcModel = mongoose.model('equipamento', PcSchema);

class Pc {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.equipamento = null;
    }
    async register() {
        this.limpaBody();
        this.validacao();
       await this.tomboExistente();
    }
    async tomboExistente() {
        const tombos = await PcModel.findOne({ tombo: this.body.tombo });
        if (tombos) {
            this.errors.push('tombo já existe');
            return;
        }
         await this.create();
    }
    async create() {
        if(this.errors.length > 0){
            return;
        }
        this.equipamento = await PcModel.create(this.body);
    }
    validacao() {
        if (!this.body.telefone) {this.errors.push('telefone é obrigatorio')};
        if (!this.body.unidade) {this.errors.push('unidade é obrigatorio')};
        if (!this.body.responsavel) {this.errors.push('responsavel é obrigatorio')};
        if (!this.body.tombo) {this.errors.push('tombo é obrigatorio')};
        if (!this.body.tipo) {this.errors.push('tipo é obrigatorio')};
    }
    async edit(id) {
        if (typeof id !== "string") return;
        this.validacao();
        if (this.errors.length > 0) return;
        this.equipamento = await PcModel.findByIdAndUpdate(id, this.body, { new: true });
    }
    static async buscaEquipamentos() {
        const equipamentos = await PcModel.find().sort({
            criadoEm: -1
        });
        return equipamentos;
    }
    static async buscaPorId(id) {
        if (typeof id !== "string") return;
        const equipamento = await PcModel.findById(id);
        return equipamento;
    }
    static async delete(id) {
        if (typeof id !== "string") return;
        const equipamento = PcModel.findByIdAndDelete(id);
        return equipamento;
    }
    limpaBody() {
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