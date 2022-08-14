import Login from '../../controllers/loginController'

function relogio() {
    const relogio = document.querySelector('.relogio');
    let hora = 1;
    let min = 0;
    let segundos = 0;
    let timer;

    if (req.session.user) {
        inicio();
    }

    function cronometro() {
        if (hora > 0 && min === 0) {
            console.log('passou no if min hora')
            hora--;
            min = 60;
        }
        if (min > 0 && segundos === 0) {
            console.log('passou no if min')
            min--;
            segundos = 59;
        }
        if (hora === 0 && min === 0 && segundos === 1) {
            Login.logout();
        }
        formatacao();
    }

    function inicio() {
        timer = setInterval(function() {
            cronometro();
            segundos--;
        }, 1000);
    }


    function returnData(input) {
        return input > 10 ? input : `0${input}`;
    }

    function formatacao() {
        // hora = returnData(hora);
        min = returnData(min);
        segundos = returnData(segundos);
        relogio.innerHTML = `0${hora}:${min}:${segundos}`;
    }
}

relogio();