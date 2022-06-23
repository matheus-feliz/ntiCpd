const { async } = require('regenerator-runtime');
const Pc = require('../models/PcModel');

exports.indexCadastro = (req, res) => {
    res.render('cadastroComputador', {
        equipamento: {}
    });
}
exports.indexEdit = async function (req, res) {
    try{
        if (!req.params.id) return res.render('404');
        const equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) return res.render('404');
        res.render('cadastroComputador', { equipamento });
    }catch(e){
        res.render('404');
    }
}

exports.edit = async function (req, res) {
    try {
        const pc = new Pc(req.body);
        await pc.edit(req.params.id);
        
            if (pc.errors.length > 0) {
                req.flash('errors', pc.errors);
                req.session.save(function () {
                    console.log(pc.equipamento._id);
                    return res.redirect(`/cadastrocomputador/edit/${pc.equipamento._id}`);
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
        console.log(e);
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
        const equipamento = await Pc.buscaPorId(req.params.id);
        if (!equipamento) return res.render('404');
        res.render('listagemTombo', { equipamento });
    } catch (e) {
        res.render('404');
    }
}

exports.delete = async function (req, res) {
    try{
        if (!req.params.id) return res.render('404');
        const equipamento = await Pc.delete(req.params.id);
        if (!equipamento) return res.render('404');
        req.flash('success', 'cadastro deletato com sucesso');
        req.session.save(function () {
            res.redirect(`/buscacomputador`);
            return;
        });
    }catch(e){
        res.render('404');
    }
}

exports.cadastroDeServico = (req, res) => {
    res.render('servicoComputador');
}