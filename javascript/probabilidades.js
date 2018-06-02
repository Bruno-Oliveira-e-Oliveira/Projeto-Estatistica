//Função principal para calcular as probabilidades
function mainDist(){
    //tratar para caso de Qualitativas
    //controlar os tipos de parametros em cada dist depois
    var pontos = [dados[0],dados[dados.length-1]];//Pega as extremidades dos dados ordenados
    calcDist(tipoDist,pontos,medEst[0],medEst[6]);
}

//Calcula as Distribuições
function calcDist(tipoDist,pontos,media,desvioPadrao){
    var prob = 0;

    if (tipoDist == "DB") {
        var respAnalise;
        var fatorial = function(num){
            if (num == 0) {
                return 1;
            }else {
                var resp = 1;
                for (var i = 1; i <= num; i++) {
                    resp *= i;
                }
                return resp;
            }
        }

        for (var i = 0; i < k.length; i++) {
            respAnalise = fatorial(n) / (fatorial(k[i]) * fatorial(n - k[i]));
            prob+= respAnalise * (p ** k[i]) * q ** (n - k[i]);
        }

    }else if (tipoDist == "DN") {
        //Lembrete
        //Trocar o escore de vetor para var caso nao use-o depois
        var escore;
        var pCol;
        var pLi;
        var numTab = [];

        //Calcula o escore
        for (var z = 0; z < nTrans.length; z++) {
            escore = Math.abs(parseFloat(((nTrans[z] - media) / desvioPadrao).toFixed(2)));
            pCol = Math.trunc(escore);
            pCol = parseFloat(pCol.toString() +"."+ Math.trunc((escore - pCol) *10).toString());
            pLi = Math.trunc(parseFloat((escore - pCol).toFixed(2))*100);

            //Localiza o numero da tabela que é referente ao escore
            for (var i = 0; i < tabelaDN.length; i++) {
                if (pCol == tabelaDN[i][0]) {
                    for (var j = 0; j < tabelaDN[0].length; j++) {
                        if (pLi == tabelaDN[0][j]) {
                            numTab.push(tabelaDN[i][j]);
                        }
                    }
                }
            }
        }

        //Tratamento das possibilidades
        if (op == "entre") {
            if (nTrans.length == 1 ) {
                prob = numTab[0];
            }else if ((nTrans[0] <= media && nTrans[1] >= media) || (nTrans[0] >= media && nTrans[1] <= media)) {
                prob = numTab[0] + numTab[1];
            }else if (nTrans[0] > media && nTrans[1] > media) {
                if (nTrans[0] > nTrans[1]) {
                    prob = numTab[0] - numTab[1];
                } else {
                    prob = numTab[1] - numTab[0];
                }
            }else if (nTrans[0] < media && nTrans[1] < media) {
                if (nTrans[0] < nTrans[1]) {
                    prob = numTab[0] - numTab[1];
                } else {
                    prob = numTab[1] - numTab[0];
                }
            }
        }else if (op == "maiorQ") {
            if (nTrans[0] > media) {
                prob = 0.5 - numTab[0];
            } else {
                prob = 0.5 + numTab[0];
            }
        }else if (op == "menorQ") {
            if (nTrans[0] < media) {
                prob = 0.5 - numTab[0];
            } else {
                prob = 0.5 + numTab[0];
            }
        }

    }else if (tipoDist == "DU") {
        var mediaDU;
        var desvioDU;
        var coeficienteDU;
        var num;

        mediaDU = (pontos[0] + pontos[1]) / 2;
        desvioDU = Math.sqrt(((pontos[1] - pontos[0]) ** 2) / 12);
        desvioDU = parseFloat((desvioDU).toFixed(2));
        coeficienteDU = parseFloat(((desvioDU / mediaDU) * 100).toFixed(2));

        //Tratamento das possibilidades
        if (opU == "entre") {
            if (numIntervalo[0] > numIntervalo[1]) {
                num = numIntervalo[0] - numIntervalo[1];
            } else {
                num = numIntervalo[1] - numIntervalo[0];
            }
        }else if (opU == "maiorQ") {
            num = pontos[1] - numIntervalo[0];
        }else if (opU == "menorQ") {
            num = numIntervalo[0] - pontos[0];
        }else if (opU == "deAte") {
            num = (numIntervalo[1] - 1) - numIntervalo[0];
        }

        //Função Probabilidade
        prob = (1 / (pontos[1] - pontos[0])) * num;
    }
    prob = parseFloat((prob *100).toFixed(2));
}
