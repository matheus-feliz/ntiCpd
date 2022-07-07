
const { async } = require('regenerator-runtime');
const ServicoComEquipamento = require('../models/ServicoComEquipamentoModel');
const ServicoSemEquipamento = require('../models/ServicoSemEquipamentoModel');

exports.relatorio =(req, res) => {// inicio do relatorio
    res.render('relatorio',{total:{}, totalDeServico:0, dataInicial:'', dataFinal:''});
}

exports.relatorioBanco = async (req, res) => {//faz o relatorio
    try {
        let dataInicial = ServicoSemEquipamento.FormataData(req.body.busca[0]);
        let dataFinal = ServicoSemEquipamento.FormataData(req.body.busca[1]);
        let servicoComEquipamento = await ServicoComEquipamento.buscaPorData(dataInicial, dataFinal);
        let servicoSemEquipamento = await ServicoSemEquipamento.buscaPorData(dataInicial, dataFinal);
        let servicoTotal = servicoComEquipamento.concat(servicoSemEquipamento);
              
        let totalDeServico = servicoTotal.length;
        let total = [];
        for (let i = 0; i < servicoTotal.length; i++) {
            total.push({
                nomeDaUnidade: servicoTotal[i].unidade,
                formatacao: 0,
                pontoDeRede: 0,
                reparos: 0,
                visitas: 0,
                total: 0
            })
        }
        for (let i = 0; i < servicoTotal.length; i++) {
            if (total[i].nomeDaUnidade === servicoTotal[i].unidade) {
                if (servicoTotal[i].tipo === "Formatação") {
                    total[i].formatacao++;
                    total[i].total++;
                }
                else if (servicoTotal[i].tipo === "Ponto De Rede") {
                    total[i].pontoDeRede++;
                    total[i].total++;
                }
                else if (servicoTotal[i].tipo === "Reparos\\Configuração") {
                    total[i].reparos++;
                    total[i].total++;
                }
                else if (servicoTotal[i].tipo === "VisitaTecnica\\Reparos\\Configuração") {
                    total[i].visitas++;
                    total[i].total++;
                }
                for (let j = i + 1; j < servicoTotal.length; j++) {
                    if (total[i].nomeDaUnidade === servicoTotal[j].unidade && total[i].nomeDaUnidade === total[j].nomeDaUnidade) {
                        if (servicoTotal[j].tipo === "Formatação") {
                            total[i].formatacao++;
                            total[i].total++;
                        }
                        else if (servicoTotal[j].tipo === "Ponto De Rede") {
                            total[i].pontoDeRede++;
                            total[i].total++;
                        }
                        else if (servicoTotal[j].tipo === "Reparos\\Configuração") {
                            total[i].reparos++;
                            total[i].total++;
                        }
                        else if (servicoTotal[j].tipo === "VisitaTecnica\\Reparos\\Configuração") {
                            total[i].visitas++;
                            total[i].total++;
                        }
                        servicoTotal.splice(j, 1);
                        total.splice(j, 1);
                        j--;
                    }
                }
            }
        } 
        res.render('relatorio',{total, totalDeServico, dataInicial, dataFinal});
    }
    catch (e) {
        console.log(e)
    }
}