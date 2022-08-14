function pdf() {
    var relatorio = document.getElementById('tabela');
    var opt = {
        margin: 0.25,
        filename: 'relatorio.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        }
    };
    html2pdf().set(opt).from(relatorio).save();
}