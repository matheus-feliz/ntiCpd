const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
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
    tipo: {
        type: String,
        required: true
    },
    dataDeServico: {
        type: Date, default: Date.now,
        required: true
    },
    observacao: {
        type: String,
        required: false
    },
    criadoEm: { type: Date, default: Date.now }
});

const ServicoMOdel = mongoose.model('servicoSemEquipamento', ServicoSchema);

class servicoSemEquipamento {
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
        this.servico = await ServicoMOdel.create(this.body);
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
            tipo: this.body.tipo,
            dataDeServico: this.body.dataDeServico,
            observacao: this.body.observacao
        }

    }
    dateFormatacao() {

    }
    validacao() {
        if (!this.body.telefone) { this.errors.push('telefone é obrigatorio') };
        if (!this.body.unidade) { this.errors.push('unidade é obrigatorio') };
        if (!this.body.responsavel) { this.errors.push('responsavel é obrigatorio') };
        if (!this.body.tipo) { this.errors.push('tipo de servico é obrigatorio') };
        if (!this.body.dataDeServico) { this.errors.push('data de serviço é obrigatorio') };
    }

    static async buscaListagem(unidade) {
        if (typeof unidade !== "string") return;
        const servicos = await ServicoMOdel.find({
            unidade: unidade
        }).sort({
            criadoEm: -1,
        });
        return servicos;
    }

    static async buscaPorId(id) {
        if (typeof id !== "string") return;
        const servico = await ServicoMOdel.findById(id);
        return servico;
    }

    async edit(id) {
        if (typeof id !== "string") return;
        this.validacao();
        if (this.errors.length > 0) return;
        this.servico = await ServicoMOdel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async deleteOne(id) {
        if (typeof id !== "string") return;
        const servico = await ServicoMOdel.findByIdAndDelete(id);
        return servico;
    }
}

module.exports = servicoSemEquipamento;