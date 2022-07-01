
const Pc = require('../models/PcModel');
const Servico = require('../models/ServicoComEquipamentoModel');
const ServicoUnidade = require('../models/ServicoSemEquipamentoModel')

exports.indexCadastro = (req, res) => { // get cadastro de equipamento
    res.render('cadastroComputador', {
        equipamento: {}
    });
}
exports.cadastro = async function (req, res) { // post cadastro de equipamento
    try {
        const pc = new Pc(req.body);
        await pc.register();

        if (pc.errors.length > 0) {
            req.flash('errors', pc.errors);
            req.session.save(function () {
                return res.redirect('/cadastrocomputador');
            });
            return;
        }

        req.flash('success', 'cadastro efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemcomputador/${pc.equipamento._id}`);
            return;
        })

    } catch (e) {
        console.log(e)
        return res.render('404');
    }
}

exports.indexEdit = async function (req, res) { // get edit de equipamento
    try {
        if (!req.params.id) return res.render('404');
        const equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) return res.render('404');
        res.render('cadastroComputador', { equipamento });
    } catch (e) {
        res.render('404');
    }
}

exports.edit = async function (req, res) { // post edit de equipamento
    try {
        const pc = new Pc(req.body);
        await pc.edit(req.params.id);

        if (pc.errors.length > 0) {
            req.flash('errors', pc.errors);
            req.session.save(async function () {
                const equipamento = await Pc.buscaPorId(req.params.id);
                res.redirect(`/cadastrocomputador/edit/${equipamento._id}`);
                return;
            });
            return;
        }

        req.flash('success', 'edição efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemcomputador/${pc.equipamento._id}`);
            return;
        })

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.busca = async function (req, res) {// busca sem ir no banco(vazio)
    res.render('buscaComputador', {
        equipamentos: {}
    });
}
exports.buscaRetorno = async function (req, res) {//busca com redorno do banco
    const equipamentos = await Pc.busca(req.body.busca);
    if (equipamentos.length === 0) {
        req.session.save(async function () {
            req.flash('errors', 'equipamento não encontrado');
            res.render('buscaComputador', {
                equipamentos
            });
            return;
        });
    };
    res.render('buscaComputador', {
        equipamentos
    });

}
exports.delete = async function (req, res) { // delete de equipamento
    try {
        if (!req.params.id) return res.render('404');
        const equipamento = await Pc.delete(req.params.id);
        if (!equipamento) return res.render('404');
        req.flash('success', 'cadastro deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/buscacomputador`);
            return;
        });
    } catch (e) {
        res.render('404');
    }
}
//servico com equipamento daqui para baixo
exports.listagem = async function (req, res) { // listagem de servico
    try {
        if (!req.params.id) return res.render('404');
        let equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) {
            let servicoID = await Servico.buscaPorId(req.params.id);
            equipamento = await Pc.buscaListagem(servicoID.tombo);
            if (!equipamento) return res.render('404');
        };
        servicos = await Servico.buscaListagem(equipamento.tombo);
        res.render('listagemTombo', { equipamento, servicos });

    } catch (e) {
        console.log(e)
        res.render('404');
    }
}

exports.cadastroDeServico = async function (req, res) { // get cadastro de servico com equipamento
    try {
        if (!req.params.id) return res.render('404');
        let equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) {
            const servicoID = await Servico.buscaPorId(req.params.id);
            let equipamento = await Pc.buscaListagem(servicoID.tombo);
            if (!equipamento) return res.render('404');
        };
        res.render('servicoComputador', { equipamento });
    } catch (e) {
        res.render('404');
    }
}

exports.cadastroDeServicoPost = async function (req, res) { // post cadastro de servico com equipamento
    try {
        const servicoUnidade = await ServicoUnidade.busca();
        const servicoEquipamento =  await Servico.busca();
        let numeroDeServico = servicoUnidade.length + servicoEquipamento.length + 1;
        const servico = new Servico(req.body, numeroDeServico.toString());
        await servico.register();
        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(async function () {
                const equipamento = await Pc.buscaListagem(req.body.tombo);
                if (!equipamento) return res.render('404');
                res.redirect(`/cadastrodeequipamento/${equipamento._id}`);
                return;
            });
            return;
        }

        req.flash('success', 'cadastro efetuado com sucesso');
        req.session.save(function () {

            res.redirect(`/listagemcomputador/${servico.servico._id}`);
            return;
        })
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.editServico = async function (req, res) {// get edit de servico 
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        if (!servico) res.render('404');
        res.render('servicoComputadorEdit', { servico });

    } catch (e) {
        res.render('404');
    }
}
exports.editServicoCadastro = async function (req, res) { // post edit de servico 
    try {
        const servico = new Servico(req.body);
        await servico.edit(req.params.id);
        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(async function () {
                const editServico = await Servico.buscaPorId(req.params.id);
                return res.redirect(`/cadastrodeequipamento/edit/${editServico._id}`);
            });
            return;
        }
        req.flash('success', 'edição efetuado com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemcomputador/${servico.servico._id}`);
            return;
        });
    } catch (e) {
        console.log(e)
        res.render('404')
    }
}

exports.deleteServicoUm = async function (req, res) {// delete de servico 
    try {
        if (!req.params.id) return res.render('404');
        const equipamentoServico = await Servico.buscaPorId(req.params.id);
        const equipamento = await Pc.buscaListagem(equipamentoServico.tombo);
        const servico = await Servico.deleteOne(req.params.id);
        if (!servico) return res.render('404');
        req.flash('success', 'servico deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/listagemcomputador/${equipamento._id}`);
            return;
        });
    } catch (e) {
        res.render('404');
    }
}

exports.impressao = async function (req, res) {// impressão de servico com equipamento
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        if (!servico) res.render('404');
        res.render('impressao', { servico });

    } catch (e) {
        res.render('404');
    }
}