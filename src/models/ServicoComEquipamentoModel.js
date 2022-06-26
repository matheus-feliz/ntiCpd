const mongoose = require('mongoose');

const EquipamentoSchema = new mongoose.Schema({
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
    backup: {
        type: String,
        required: true
    },
    dataInicial: {
        type: Date, default: Date.now,
        required: true
    },
    dataFinal: {
        type: Date, default: Date.now,
        required: true
    },
    solucao: {
        type: String,
        required: false
    },
    observacao: {
        type: String,
        required: false
    },
    criadoEm: { type: Date, default: Date.now }
});

const EquipamentoMOdel = mongoose.model('servicoComEquipamento', EquipamentoSchema);

class servicoComEquipamento {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.servico = null;
    }

    async register() {
        this.limpaBody();
        this.validacao();
        await this.create();
    }

    async create() {
        if (this.errors.length > 0) {
            return;
        }
        this.servico = await EquipamentoMOdel.create(this.body);
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
            backup: this.body.backup,
            dataInicial: this.body.dataInicial,
            dataFinal: this.body.dataFinal,
            solucao: this.body.solucao,
            observacao: this.body.observacao
        }

    }
    dateFormatacao() {

    }
    validacao() {
        if (!this.body.telefone) { this.errors.push('telefone é obrigatorio') };
        if (!this.body.unidade) { this.errors.push('unidade é obrigatorio') };
        if (!this.body.responsavel) { this.errors.push('responsavel é obrigatorio') };
        if (!this.body.tombo) { this.errors.push('tombo é obrigatorio') };
        if (!this.body.tipo) { this.errors.push('tipo é obrigatorio') };
        if (!this.body.backup) { this.errors.push('backup é obrigatorio') };
        if (!this.body.dataInicial) { this.errors.push('data inicial é obrigatorio') };
        if (!this.body.dataFinal) { this.errors.push('data final é obrigatorio') };
        if (this.body.dataInicial > this.body.dataFinal) { this.errors.push('data inicial maior que a final') };
    }

    static async buscaListagem(tombo) {
        if (typeof tombo !== "string") return;
        const servicos = await EquipamentoMOdel.find({
            tombo: tombo
        }).sort({
            criadoEm: -1,
        });
        return servicos;
    }

    static async buscaPorId(id) {
        if (typeof id !== "string") return;
        const servico = await EquipamentoMOdel.findById(id);
        return servico;
    }

    async edit(id) {
        if (typeof id !== "string") return;
        console.log('passou')
        if (this.errors.length > 0) return;
        console.log('passou pelo teste de erros')
        this.servico = await EquipamentoMOdel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async deleteOne(id) {
        if (typeof id !== "string") return;
        const servico = await EquipamentoMOdel.findByIdAndDelete(id);
        return servico;
    }
}

module.exports = servicoComEquipamento;