//Funcao que ordena dados Quantitativos
function ordenarQtt(a,b){
    return a - b;
}

//Funcao que ordena dados Qualitativos ordinais usando como referencia o vetor ordem
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

//Funcao que define as classes, as variaveis e a frequencia simples da variavel pesquisada do tipo continua
function calcularVarContinua(){
    var fi = [];

    //1° Passo: Amplitude
    var amp = dados[dados.length-1] - dados[0];

    //2° Passo: Classes
    var classes = [];
    classes.push(parseInt(Math.sqrt(dados.length)));
    classes.unshift(classes[0]-1);
    classes.push(classes[1]+1);

    //3° Passo: Intervalo
    var continuar = true;
    var classe;

    do {
        amp++;

        for (var i = 0; i < classes.length; i++) {
            if (amp % classes[i] == 0 && classe == null) {
                continuar = false;
                classe = classes[i];

            }
        }
    } while (continuar);

    var intervalo = amp / classe;

    //Preencher vetor classe e calculando variaveis
    var varIni = [];
    var varFim = [];
    var num = dados[0];
    classes = []

    for (var i = 0; i < classe; i++) {
        varIni.push(num);
        num+= intervalo;
        varFim.push(num);
        classes.push(i+1);
    }

    // Calcular as frequencias simples
    var contFi;

    for (var i = 0; i < varIni.length; i++) {
        contFi = 0;
        for (var j = 0; j < dados.length; j++) {
            if (dados[j] >= varIni[i] && dados[j] < varFim[i]) {
                contFi++;
            }
        }
        fi.push(contFi);
    }

    return [classes,varIni,varFim,fi];

}

//Funcao que calcula as variaveis e frequencias
function calcularFreq(){
    var mat = [];
    var varPesq = [];
    var fi = [];
    var frP = [];
    var fac = [];
    var facP = [];

    varPesq.push(dados[0]);

    if (tipoVar == "CNT") {
        var posFi = 3;
        varPesq = [];
        fi = [];
        mat = calcularVarContinua();

    } else if (tipoVar == "DSC" || tipoVar == "ORD" || tipoVar == "NML") {
        var contfi = 0;
        var cont = 0;
        var posFi = 1;

        for (var i = 0; i < dados.length; i++) {
            if (dados[i] == varPesq[cont]) {
                contfi++;
            }else {
                fi.push(contfi);
                varPesq.push(dados[i]);
                contfi = 1;
                cont++;
            }
            if (i == (dados.length-1)) {
                fi.push(contfi);
            }
        }

        mat.push(varPesq);
        mat.push(fi);

    }

    //Calcular frequencia relativa percentual, acumulada e acumulada percentual
    var somaFi = 0;
    var num = 0;
    var soma = 0;

    for (var i = 0; i < mat[posFi].length; i++) {
        somaFi += mat[posFi][i];
    }

    fac.push(mat[posFi][0]);

    for (var i = 0; i < mat[0].length; i++) {
        frP.push(parseFloat(((mat[posFi][i]/ somaFi)*100).toFixed(2)));
        soma = frP[i] + num;
        facP.push(parseFloat(soma.toFixed(2)));
        num = facP[i];
        if (i < mat[0].length -1) {
            fac.push(fac[i] + mat[posFi][i+1]);
        }
    }
    mat.push(frP);
    mat.push(fac);
    mat.push(facP);

    return mat;
}

// Gerador de tabela

function gerarTabela(matriz){
    var tabela = document.createElement("table");
    var cab = document.createElement("thead");
    var trhead = document.createElement("tr");
    var corpo = document.createElement("tbody");
    var head;

    if (tipoVar == "CNT") {
        head = ["Classes",nomeVar,nomeFi,"fr%","Fac","Fac%"];
    } else {
        head = [nomeVar,nomeFi,"fr%","Fac","Fac%"];
    }

    for (var i = 0; i < head.length; i++) {

        var th = document.createElement("th");

        th.appendChild(document.createTextNode(head[i]));
        trhead.appendChild(th);
    }
    cab.appendChild(trhead);
    tabela.appendChild(cab);

    for (var i = 0; i < matriz[0].length; i++) {
        var tr = document.createElement("tr");

        for (var j = 0; j < matriz.length; j++) {
            var td = document.createElement("td");

            if (tipoVar == "CNT" && j == 1) {
                td.appendChild(document.createTextNode(matriz[j][i] +" |---- "+matriz[j+1][i]));
            }else if(tipoVar == "CNT" && j == 2){
                continue;
            }else {
                td.appendChild(document.createTextNode(matriz[j][i]));
            }
            tr.appendChild(td);
        }
        corpo.appendChild(tr);
    }
    tabela.appendChild(corpo);
    document.getElementById('dTabela').appendChild(tabela);
}

//Calcula Media, Moda, Mediana, Desvio padrao, coeficiente variacao e Separatrizes
function medidasEst(matriz){
    var media = 0;
    var mediana;
    var desvioPadrao = 0;
    var coeficienteVar;
    var num;
    var medidas;

    //Caso seja Discreta
    if (tipoVar == "DSC") {
        var somaFi = matriz[3][matriz[3].length -1];
        var moda = [];
        var maior = matriz[1][0];
        var pos = somaFi/2;
        var soma;


        for (var i = 0; i < matriz[0].length; i++) {
            media += matriz[0][i] * matriz[1][i];

            if (maior < matriz[1][i]) {
                maior = matriz[1][i];
            }

            if (matriz[3][i] >= pos && soma == null) {
                soma = matriz[0][i];
            }

            if (matriz[3][i] >= (pos+1) && mediana == null) {
                soma += matriz[0][i];
                mediana = soma/2;
            }
        }
        media = parseFloat((media/somaFi).toFixed(2));

        for (var i = 0; i < matriz[0].length; i++) {
            desvioPadrao += ((matriz[0][i] - media) ** 2) * matriz[1][i];

            if (matriz[1][i] == maior) {
                moda.push(matriz[0][i]);
            }

            if (moda.length == matriz[0].length) {
                moda = null;
            }
        }
        medidas = [media,mediana,moda];

    // Caso seja continua
    }else if (tipoVar == "CNT") {
        var pMedio = [];
        var somaFi = matriz[5][matriz[5].length -1];
        var posicao = [somaFi/2, somaFi/2 + 1];
        var posMediana = new Array(2);
        var posModa = [];
        var intervalo = matriz[2][0] - matriz[1][0];
        var facAnt = [];
        var maior = matriz[3][0];
        var modaConv = [];
        var modaPearson;
        var modaKing = [];
        var modaCzuber = [];


        //Calcula o ponto médio das variaveis, calcula a media, encontra o maior valor das fi e
        //encontra a posição da mediana
        for (var i = 0; i < matriz[0].length; i++) {
            pMedio.push((matriz[1][i] + matriz[2][i])/2);
            media += pMedio[i] * matriz[3][i];

            if (matriz[5][i] >= posicao[0] && posMediana[0] == null) {
                posMediana[0] = i;
            }
            if (matriz[5][i] >= posicao[1] && posMediana[1] == null) {
                posMediana[1] = i;
            }

            if (maior < matriz[3][i]) {
                maior = matriz[3][i];
            }

        }
        media = parseFloat((media/somaFi).toFixed(2));

        //Testa para ver se a classe da mediana é a primeira posição do vetor e trata para
        //que não ocorra acesso a posições que não existem,e calcula a mediana.
        if (posMediana[0] == 0) {
            facAnt.push(0);
        }else {
            facAnt.push(matriz[5][posMediana[0]-1]);
        }

        if (posMediana[1] == 0) {
            facAnt.push(0);
        }else {
            facAnt.push(matriz[5][posMediana[1]-1]);
        }

        mediana = matriz[1][posMediana[0]] + (((posicao[0] - facAnt[0]) / matriz[3][posMediana[0]]) * intervalo);
        mediana += matriz[1][posMediana[1]] + (((posicao[0] - facAnt[1]) / matriz[3][posMediana[1]]) * intervalo);
        mediana = parseFloat((mediana/2).toFixed(2));

        //Calcula as 4 modas, o desvio padrao e o coeficiente de variacao
        for (var i = 0; i < matriz[0].length; i++) {
            desvioPadrao += ((pMedio[i] - media) ** 2) * matriz[3][i];

            if (matriz[3][i] == maior) {
                modaConv.push(pMedio[i]);
                posModa.push(i);
            }

        }

        if (modaConv.length == matriz[0].length) {
            modaConv = "Amodal";
        }

        //Testa se a moda convencional não é amodal
        if (modaConv != "Amodal") {
            var fiAnt;
            var fiPost;
            var valor;

            for (var i = 0; i < modaConv.length; i++) {
                //Testa se a classe modal é a primeira ou a última posição do vetor para que não haja acesso
                //a posições que não existem.
                if (posModa[i] == 0) {
                    fiAnt = 0;
                }else {
                    fiAnt = matriz[3][posModa[i]-1];
                }

                if (posModa[i] == matriz[0].length -1) {
                    fiPost = 0;
                }else {
                    fiPost = matriz[3][posModa[i]+1];
                }

                valor = matriz[1][posModa[i]] + ((fiPost) / (fiAnt + fiPost)) * intervalo;
                modaKing.push(parseFloat((valor).toFixed(2)));

                valor = matriz[1][posModa[i]] + ((matriz[3][posModa[i]] - fiAnt) / ((matriz[3][posModa[i]] - fiAnt) + (matriz[3][posModa[i]] - fiPost))) * intervalo;
                modaCzuber.push(parseFloat((valor).toFixed(2)));

            }
            modaPearson = parseFloat((3 * mediana - 2 * media).toFixed(2));
        }else {
            modaPearson = "Amodal";
            modaKing = "Amodal";
            modaCzuber = "Amodal";
        }
        medidas = [media,mediana,modaConv,modaPearson,modaKing,modaCzuber];
    }

    //Diferencia caso seja populacao ou amostra
    if (tipoPesq == "POP") {
        num = 0;
    }else if (tipoPesq == "AMS") {
        num = 1;
    }

    desvioPadrao = Math.sqrt(desvioPadrao / (somaFi - num));
    desvioPadrao = parseFloat((desvioPadrao).toFixed(2));
    coeficienteVar = parseFloat(((desvioPadrao / media) * 100).toFixed(2));
    medidas.push(desvioPadrao);
    medidas.push(coeficienteVar);

    return medidas;
}

//Gera o gráfico
function gerarGrafico(matriz){
    var graf = document.getElementById('grafico').getContext('2d');
    var tipoGraf;
    var labels;
    var data;
    var options;

    if (tipoVar == "DSC") {
        tipoGraf = 'bar';
        labels = matriz[0];
        data = matriz[1];
        options = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    }else if (tipoVar == "CNT") {
        tipoGraf = 'bar';
        data = matriz[3];
        options = {
            legend: { display: false },
            animation: {
                animateScale: true
            },
            scales: {
                xAxes: [{
                    barPercentage: 1,
                    categoryPercentage: 1
                }],
                yAxes: [{
                barPercentage: 1,
                    categoryPercentage: 1,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
            }
        };

        labels = [];
        for (var i = 0; i < matriz[0].length; i++) {
            labels.push(matriz[1][i] +" |--- "+ matriz[2][i]);
        }
    }else if (tipoVar == "ORD" || tipoVar == "NML") {
        tipoGraf = 'pie';
        labels = matriz[0];
        data = matriz[1];
    }

    var chart = new Chart(graf, {
        type: tipoGraf,
        data: {
            labels: labels,
            datasets: [
                {
                    label: nomeFi,
                    data: data,
                    backgroundColor: ["#ff2200","#00008B","#228B22","#4169E1","#ADFF2F","#DAA520","#A0522D","#4B0082","#7B68EE","#DC143C","#FF8C00","#F08080","#8A2BE2"],
                    borderWidth: 0
                }
            ]
        },
        options: options
    });

}

//Calcula as Medidas Separatrizes
function medSeparatrizes(matriz){
    var pos;
    var num;
    var resposta;

    if (tipoVar == "DSC") {
        var somaFi = matriz[3][matriz.length-1];
        pos = Math.round((somaFi * (valorSeparatriz/100)));

        for (var i = 0; i < matriz[0].length; i++) {
            if (matriz[3][i] >= pos && num == null) {
                num = matriz[0][i];
            }
        }
    }else if (tipoVar == "CNT") {
        var somaFi = matriz[5][matriz.length-1];
        var intervalo = matriz[2][0] - matriz[1][0];
        var classe;
        var facAnt;
        pos = (somaFi * (valorSeparatriz/100));

        for (var i = 0; i < matriz[0].length; i++) {
            if (matriz[5][i] >= pos && classe == null) {
                classe = i;
            }
        }

        if (classe == 0) {
            facAnt = 0;
        }else {
            facAnt = matriz[5][classe-1];
        }

        num = matriz[1][classe] + (((pos - facAnt)/matriz[3][classe]) * intervalo);
        num = parseFloat((num).toFixed(2));
    }
    resposta = valorSeparatriz+"%: "+num+" ou - <br>"+(100 - valorSeparatriz)+"%: "+num+" ou +";
    return resposta;
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

//Gera o grafico da regressao
function gerarGraficoReg(a,b,coefLinear){
    var ctx = document.getElementById('grafReg').getContext('2d');
    var dataS = [];
    var dataL = [];
    var maior = yHist[0];

    for (var i = 0; i < xHist.length; i++) {
        dataS.push({
            x: xHist[i],
            y: yHist[i]
        });
        if (maior < yHist[i]) {
            maior = yHist[i];
        }
    }

    if (coefLinear > 0) {
        dataL = [{
            x:0, y:b
        },{
            x:(maior-b)/a, y:maior
        }]
    } else {
        dataL = [{
            x:0, y:b
        },{
            x:(-b/a), y:0
        }]
    }

    var options = {
        legend: {
            display: false
        },
        elements: {
            line: {
                tension: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }

    var regChart = new Chart(ctx, {
        type: 'scatter',
        display: false,
        data: {
            datasets: [
                {
                    data: dataS,
                    backgroundColor: "#ff2200",
                    borderColor: "#ff2200"
                },{
                    type: 'line',
                    data: dataL,
                    fill: false,
                    borderColor:"#00008B",
                    backgroundColor: "#00008B",
                    showLine: true,
                    pointRadius: 0
                }]
        },
        options: options
    });


}

//Calcula correlação e regressão
function calcCorr_Regr(){
    var somaVet = function(vet){
        var soma = 0;
        for (var i = 0; i < vet.length; i++) {
            soma += vet[i];
        }
        return soma;
    }
    var matrizHist = [yHist,xHist];
    var xY = [];
    var potY = [];
    var potX = [];
    var somaY = somaVet(matrizHist[0]);
    var somaX = somaVet(matrizHist[1]);
    var somaXY;
    var somaPy;
    var somaPx;
    var coefLinear;
    var nAmostras = matrizHist[0].length;
    var eqReta;
    var a;
    var b;
    var regY;
    var regX;

    for (var i = 0; i < matrizHist[0].length; i++) {
        xY.push(matrizHist[0][i] * matrizHist[1][i]);
        potY.push(matrizHist[0][i] ** 2);
        potX.push(matrizHist[1][i] ** 2);
    }
    somaXY = somaVet(xY);
    somaPy = somaVet(potY);
    somaPx = somaVet(potX);
    coefLinear = (nAmostras * somaXY - (somaX) * somaY) / (Math.sqrt((nAmostras * somaPx - (somaX ** 2)) * (nAmostras * somaPy - (somaY **2))));
    coefLinear = parseFloat(coefLinear.toFixed(2));

    //Regressão
    a = (nAmostras * somaXY - somaX * somaY) / (nAmostras * somaPx - (somaX ** 2));
    a = parseFloat(a.toFixed(2));
    regY = somaY / nAmostras;
    regX = somaX / nAmostras;
    b = regY - a * regX;
    b = parseFloat(b.toFixed(2));
    eqReta = "Y = "+a+"X + "+b;
    gerarGraficoReg(a,b,coefLinear);

    console.log("Coeficiente Linear: "+coefLinear);
    console.log("Equação da reta: "+eqReta);
}
