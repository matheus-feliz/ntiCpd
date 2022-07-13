const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({//dados
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
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    observacao: {
        type: String,
        required: false
    },
    criadoEm: { type: Date, default: Date.now }
});

const ServicoMOdel = mongoose.model('servicoSemEquipamento', ServicoSchema);//conexão com o banco

class servicoSemEquipamento {
    constructor(body, numero) {
        this.body = body;
        this.body.numero = numero;
        this.errors = [];
        this.servico = null;
    }

    async register() {//cadastro
        this.limpaBody();
        this.dateFormatacao();
        this.validacao();
        await this.create();
    }

    async create() {//registra no banco de dados
        if (this.errors.length > 0) {
            return;
        }
        this.servico = await ServicoMOdel.create(this.body);
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
            responsavel: this.body.responsavel,
            tipo: this.body.tipo,
            dataDeServico: this.body.dataDeServico,
            numero: this.body.numero,
            observacao: this.body.observacao.toUpperCase()
        }

    }
    static FormataData(data) {//formata data
        let dataAno = data.slice(0, 4);
        let dataMes = data.slice(5, 7);
        let dataDia = data.slice(8, 10);
        let dataCompleta = [dataDia, "/", dataMes, "/", dataAno].join('');
        return dataCompleta;
    }
    FormataDataNoStatic(data) {//formata data static
        let dataAno = data.slice(0, 4);
        let dataMes = data.slice(5, 7);
        let dataDia = data.slice(8, 10);
        let dataCompleta = [dataDia, "/", dataMes, "/", dataAno].join('');
        return dataCompleta;
    }
    dateFormatacao() {//implementa a formata data 
        this.body.dataDeServico = this.FormataDataNoStatic(this.body.dataDeServico);
    }
    validacao() {//valida os dados
        if (!this.body.telefone) { this.errors.push('telefone é obrigatorio') };
        if (!this.body.unidade) { this.errors.push('unidade é obrigatorio') };
        if (!this.body.responsavel) { this.errors.push('responsavel é obrigatorio') };
        if (!this.body.tipo) { this.errors.push('tipo de servico é obrigatorio') };
        if (!this.body.dataDeServico) { this.errors.push('data de serviço é obrigatorio') };
    }

    static async busca() {// busca
        const servicos = await ServicoMOdel.find();
        return servicos;
    }
    static async buscaPorData(dataInicial, dataFinal) {//busca relatorio
        if (typeof dataInicial !== "string" && typeof dataFinal !== 'string') return;
        const servicos = await ServicoMOdel.find({
            dataDeServico: { "$gte": dataInicial, "$lte": dataFinal }
        }).sort({
            criadoEm: -1,
        });
        return servicos;

    }
    static async buscaListagem(unidade) {// busca listagem
        if (typeof unidade !== "string") return;
        const servicos = await ServicoMOdel.find({
            unidade: unidade
        }).sort({
            criadoEm: -1,
        });
        return servicos;
    }

    static async buscaPorId(id) {// busca por id
        if (typeof id !== "string") return;
        const servico = await ServicoMOdel.findById(id);
        return servico;
    }

    async edit(id) {//edit de dados
        if (typeof id !== "string") return;
        this.validacao();
        this.dateFormatacao();
        if (this.errors.length > 0) return;
        this.servico = await ServicoMOdel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async deleteOne(id) {//deleta um dado
        if (typeof id !== "string") return;
        const servico = await ServicoMOdel.findByIdAndDelete(id);
        return servico;
    }
}

module.exports = servicoSemEquipamento;