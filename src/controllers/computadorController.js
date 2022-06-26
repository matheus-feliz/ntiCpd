
const { async } = require('regenerator-runtime');
const Pc = require('../models/PcModel');
const Servico = require('../models/ServicoComEquipamentoModel');

exports.indexCadastro = (req, res) => {
    res.render('cadastroComputador', {
        equipamento: {}
    });
}
exports.indexEdit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) return res.render('404');
        res.render('cadastroComputador', { equipamento });
    } catch (e) {
        res.render('404');
    }
}

exports.edit = async function (req, res) {
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

exports.cadastro = async function (req, res) {
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
        return res.render('404');
    }
}

exports.busca = async function (req, res) {
    const equipamentos = await Pc.buscaEquipamentos();
    res.render('buscaComputador', {
        equipamentos
    });
}
exports.listagem = async function (req, res) {
    try {        
        if (!req.params.id) return res.render('404');
        let equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) {
           let servicoID = await Servico.buscaPorId(req.params.id);
            equipamento =await Pc.buscaListagem(servicoID.tombo);
            if (!equipamento) return res.render('404');
        };
            servicos = await Servico.buscaListagem(equipamento.tombo);
            res.render('listagemTombo', { equipamento, servicos });

    } catch (e) {
        console.log(e)
        res.render('404');
    }
}

exports.delete = async function (req, res) {
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

exports.cadastroDeServico = async function (req, res) {
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

exports.cadastroDeServicoPost = async function (req, res) {
    try {
        const servico = new Servico(req.body);
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

exports.editServico = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        if (!servico) res.render('404');
        res.render('servicoComputadorEdit', { servico });

    } catch (e) {
        res.render('404');
    }
}
exports.editServicoCadastro = async function (req, res) {
    try {
        const servico = new Servico(req.body);
        await servico.edit(req.params.id);
        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(function () {
                return res.redirect(`/cadastrodeequipamento/edit/${servico.servico._id}`);
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

exports.deleteServicoUm = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.deleteOne(req.params.id);
        if (!servico) return res.render('404');
        req.flash('success', 'servico deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/buscacomputador`);
            return;
        });
    } catch (e) {
        res.render('404');
    }
}

exports.impressao = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const servico = await Servico.buscaPorId(req.params.id);
        console.log(servico,'delete')
        if (!servico) res.render('404');
        res.render('impressao', { servico });

    } catch (e) {
        res.render('404');
    }
}