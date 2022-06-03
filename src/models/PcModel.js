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
        required: true
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
        this.tomboExistente();
    }

    async tomboExistente() {
        const tombos = await PcModel.findOne({ tombo: this.body.tombo });
        if (tombos) {
            this.errors.push('tombo já existe');
            return;

        }
        this.create();
    }
    async create() {
        this.equipamento = await PcModel.create(this.body);
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