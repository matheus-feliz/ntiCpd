
const Unidade = require('../models/UnidadeModel');
const Servico = require('../models/ServicoSemEquipamentoModel');
const ServicoEquipamento = require('../models/ServicoComEquipamentoModel');
const { async } = require('regenerator-runtime');

exports.indexCadastro = function (req, res) {// get cadastro de unidade
    res.render('cadastroUnidade', {
        unidade: {}
    });
}

exports.cadastro = async function (req, res) { // post cadastro de unidade
    try {
        const unidade = new Unidade(req.body);
        await unidade.register();

        if (unidade.errors.length > 0) {
            req.flash('errors', unidade.errors);
            req.session.save(function () {
                return res.redirect('/cadastrounidade');
            });
            return;
        }
        req.flash('success', 'cadastro efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemunidade/${unidade.unidade._id}`);
            return;
        })
    } catch (e) {
        console.log(e);
        res.render('404')
    }
}

exports.busca = async function (req, res) { // busca de unidade(vazio)
    res.render('buscaUnidade', { unidades: {} });
}
exports.buscaRetorno = async function (req, res) { // busca de unidade com retorno do banco
    const unidades = await Unidade.busca(req.body.busca);
    if ( unidades.length === 0) {
        req.session.save(async function () {
            req.flash('errors', 'unidade não encontrado');
            res.render('buscaUnidade', { unidades });
            return;
        });
        return;
    };
    res.render('buscaUnidade', { unidades });

}
exports.indexEdit = async function (req, res) { // get edit de unidade
    try {
        if (!req.params.id) return res.render('404');
        const unidade = await Unidade.buscaId(req.params.id);
        if (!unidade) return res.render('404');
        res.render('cadastroUnidade', { unidade });
    } catch (e) {
        res.render('404');
    }
}
exports.edit = async function (req, res) { // post edit de unidade
    try {
        const unidade = new Unidade(req.body);
        await unidade.edit(req.params.id);

        if (unidade.errors.length > 0) {
            req.flash('errors', unidade.errors);
            req.session.save(async function () {
                const unidade = await unidade.buscaId(req.params.id);
                res.redirect(`/cadastrounidade/edit/${unidade._id}`);
                return;
            });
            return;
        }

        req.flash('success', 'edição efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemunidade`);
            return;
        })
    }
    catch (e) {
        res.render('404')
    }
}
exports.delete = async function (req, res) { // delete de unidade
    try {
        if (!req.params.id) res.render('404');
        const unidade = await Unidade.delete(req.params.id);
        if (!unidade) res.render('404');
        req.flash('success', 'cadastro deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/buscaunidade`);
            return;
        });
    } catch (e) {
        res.render('404');
    }

}
//serviço de unidade daqui para baixo
exports.listagem = async function (req, res) { // listagem de unidade
    try {
        if (!req.params.id) return res.render('404');
        let unidade = await Unidade.buscaId(req.params.id)
        if (!unidade) {
            let servicoID = await Servico.buscaPorId(req.params.id)
            unidade = await Unidade.buscaListagem(servicoID.unidade)
            if (!unidade) return res.render('404');
        };
        servicos = await Servico.buscaListagem(unidade.unidade);
        res.render('listagemUnidade', { unidade, servicos });

    } catch (e) {
        console.log(e)
        res.render('404');
    }
}

exports.cadastroDeServico = async function (req, res) { // get cadstro de servico  de unidade
    try {
        if (!req.params.id) return res.render('404');
        console.log(req.params.id)
        let unidade = await Unidade.buscaId(req.params.id);
        if (!unidade) {
            const servicoID = await Servico.buscaPorId(req.params.id);
            unidade = await Unidade.buscaListagem(servicoID.unidade);
            console.log(unidade)
            if (!unidade) return res.render('404');
        };
        res.render('servicoUnidade', { unidade });
    } catch (e) {
        res.render('404');
    }
}

exports.cadastroDeServicoPost = async function (req, res) { // post cadstro de servico  de unidade
    try {
        const servicoUnidade = await Servico.busca();
        const servicoEquipamento = await ServicoEquipamento.busca();
        let numeroDeServico = servicoUnidade.length + servicoEquipamento.length + 1;
        const servico = new Servico(req.body, numeroDeServico.toString());
        await servico.register();
        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(async function () {
                const unidade = await Unidade.buscaListagem(req.body.unidade);
                if (!unidade) return res.render('404');
                res.redirect(`/cadastrodeunidade/${unidade._id}`);
                return;
            });
            return;
        }
        req.flash('success', 'cadastro efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemunidade/${servico.servico._id}`);
            return;
        })
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.editServico = async function (req, res) { // get edit de servico  de unidade
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        if (!servico) res.render('404');
        res.render('servicoUnidadeEdit', { servico });
    } catch (e) {
        res.render('404');
    }
}

exports.editServicoCadastro = async function (req, res) { // post edit de servico  de unidade
    try {
        const servico = new Servico(req.body);
        await servico.edit(req.params.id);
        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(async function () {
                const editServico = await Servico.buscaPorId(req.params.id);
                return res.redirect(`/cadastrodeservico/edit/${editServico._id}`);
            });
            return;
        }
        req.flash('success', 'edição efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemunidade/${servico.servico._id}`);
            return;
        });
    } catch (e) {
        console.log(e)
        res.render('404')
    }
}

exports.deleteServicoUm = async function (req, res) { // delete de servico  de unidade
    try {
        if (!req.params.id) return res.render('404');
        const unidadeServico = await Servico.buscaPorId(req.params.id);
        const unidade = await Unidade.buscaListagem(unidadeServico.unidade);
        const servico = await Servico.deleteOne(req.params.id);
        if (!servico) return res.render('404');
        req.flash('success', 'servico deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemunidade/${unidade._id}`);
            return;
        });
    } catch (e) {
        res.render('404');
    }
}

exports.impressao = async function (req, res) { // impressão de servico  de unidade
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        if (!servico) res.render('404');
        res.render('impressaoUnidade', { servico });

    } catch (e) {
        res.render('404');
    }
}