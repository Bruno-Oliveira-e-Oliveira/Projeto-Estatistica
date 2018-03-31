var dados = "Muito Bom;Bom;Ruim;Bom;Muito Bom;Bom;Ruim;Bom;Muito Bom";
//var dados = "vermelho;Azul;roxo;Verde;amarelo;laranja;Roxo;verde;azul"
//var dados = "5;3.6;6;6.984;2;5;3;3;25;3;5;1.896";
var ordem = ["Muito Bom","Bom","Ruim"];
var tipoVar = 2; //1- QLT Nominal  2- QLT Ordinal 3- Discreta 4- Continua

function tratarDados(dados,tipoVar){
    dados = dados.split(";");
    if (tipoVar == 1 || tipoVar == 2) {
        dados = dados.sort();
    } else if(tipoVar == 3 || tipoVar == 4) {
        for (var i = 0; i < dados.length; i++) {
            dados[i] = Number(dados[i]);
        }
    }
    return dados;
}


function ordenarQtt(dados){
    var aux;

    for (var i = 0; i < dados.length; i++) {

        if (dados[i] > dados[i+1]) {
            aux = dados[i+1];
            dados[i+1] = dados[i];
            dados[i] = aux;
            return ordenarQtt(dados);
        }
    }
    return dados;
}

function ordenarQltOrd(dados,ordem,posicao){
    var aux;

    if (posicao < 0) {
        return dados;
    }

    for (var i = 0; i < dados.length ; i++) {
        if ((dados[i] != ordem[posicao]) && (dados[i+1] == ordem[posicao]) ) {
            aux = dados[i+1];
            dados[i+1] = dados[i];
            dados[i] = aux;
            return ordenarQltOrd(dados,ordem,posicao);
        }
    }
    return ordenarQltOrd(dados,ordem,posicao-1);
}

var posicao = ordem.length-1;
dados = tratarDados(dados,tipoVar);

//document.write(ordenarQtt(dados,tipoVar));
document.write(ordenarQltOrd(dados,ordem,posicao));
