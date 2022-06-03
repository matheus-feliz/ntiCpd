const Pc = require('../models/PcModel');

exports.indexCadastro = (req, res) => {
    res.render('cadastroComputador');
}

exports.cadastro = async function(req, res) {
    try {
        const pc = new Pc(req.body);
        await pc.register();
        const equipamento = pc;

        setTimeout(() => {
            if (pc.errors.length > 0) {
                req.flash('errors', pc.errors);
                req.session.save(function() {
                    return res.redirect('/cadastrocomputador');
                });
                return;
            }

            req.flash('success', 'cadastro efetuado com sucesso');
            req.session.save(function() {
                return res.render('listagemTombo', {
                    equipamento

                });
            })
        }, 2500);
    } catch (e) {
        return res.render('404');
    }
}

exports.busca = (req, res) => {
    res.render('buscaComputador');
}
exports.listagem = (req, res) => {
    res.render('listagemTombo');
}

exports.cadastroDeServico = (req, res) => {
    res.render('servicoComputador');
}