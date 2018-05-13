//Funcao que ordena dados Quantitativos
function ordenarQtt(dados){
    var desordenado = true;

    while (desordenado) {
        var aux;

        for (var i = 0; i < dados.length; i++) {

            if (dados[i] > dados[i+1]) {
                aux = dados[i+1];
                dados[i+1] = dados[i];
                dados[i] = aux;
                break;
            }

            if (i == (dados.length-1)) {
                desordenado = false;
            }

        }
    }
    return dados;
}


//Funcao que ordena dados Qualitativos ordinais
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
    var cont = 0;
    var contFi = 0;

    for (var i = 0; i < dados.length; i++) {
        if (dados[i] >= varIni[cont] && dados[i] < varFim[cont]) {
            contFi++;
        }else {
            fi.push(contFi);
            contFi = 1;
            cont++;
        }


        if (i == (dados.length-1)) {
            fi.push(contFi);
        }

    }

    return [classes,varIni,varFim,fi];

}

// Função que soma valores de um vetor
function sum(vet){
    var soma = 0;
    for (var i = 0; i < vet.length; i++) {
        soma += vet[i];
    }

    return soma;
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
    var somaFi = sum(mat[posFi]);
    var num = 0;
    var soma = 0;

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
function calcularMedidasEst(matriz){
    var media = 0;
    var mediana;
    var desvioPadrao = 0;
    var coeficienteVar;
    var num;

    //Caso seja Discreta
    if (tipoVar == "DSC") {
        var somaFi = sum(matriz[1]);
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

    // Caso seja continua
    }else if (tipoVar == "CNT") {
        var pMedio = [];
        var somaFi = sum(matriz[3]);
        var posicao = somaFi/2;
        var posMediana;
        var intervalo = matriz[2][0] - matriz[1][0];
        var facAnt;
        var maior = matriz[3][0];
        var fiAnt;
        var fiPost;
        var modaConv = [];
        var modaPearson;
        var modaKing;
        var modaCzuber;

        //Calcula o ponto médio das variaveis, calcula a media, encontra o maior valor das fi e
        //encontra a posição da mediana
        for (var i = 0; i < matriz[0].length; i++) {
            pMedio.push((matriz[1][i] + matriz[2][i])/2);
            media += pMedio[i] * matriz[3][i];

            if (matriz[5][i] >= posicao && posMediana == null) {
                posMediana = i;
            }

            if (maior < matriz[3][i]) {
                maior = matriz[3][i];
            }

        }
        media = parseFloat((media/somaFi).toFixed(2));

        //Testa para ver se a classe da mediana é a primeira posição do vetor e trata para
        //que não ocorra acesso a posições que não existem,e calcula a mediana.
        if (posMediana == 0) {
            facAnt = 0;
        }else {
            facAnt = matriz[5][posMediana-1];
        }

        mediana = matriz[1][posMediana] + (((posicao - facAnt) / matriz[3][posMediana]) * intervalo);

        //Calcula as 4 modas, o desvio padrao e o coeficiente de variacao
        for (var i = 0; i < matriz[0].length; i++) {
            desvioPadrao += ((pMedio[i] - media) ** 2) * matriz[3][i];

            if (matriz[3][i] == maior) {
                modaConv.push(pMedio[i]);

                //Testa se a classe modal é a primeira ou a última posição do vetor para que não haja acesso
                //a posições que não existem.
                if (i == 0) {
                    fiAnt = 0;
                }else {
                    fiAnt = matriz[3][i-1];
                }

                if (i == matriz[0].length -1) {
                    fiPost = 0;
                }else {
                    fiPost = matriz[3][i+1];
                }
                //Temporário
                modaKing = matriz[1][i] + ((fiPost) / (fiAnt + fiPost)) * intervalo;
                modaKing = parseFloat((modaKing).toFixed(2));
                modaCzuber = matriz[1][i] + ((matriz[3][i] - fiAnt) / ((matriz[3][i] - fiAnt) + (matriz[3][i] - fiPost))) * intervalo;
                modaCzuber = parseFloat((modaCzuber).toFixed(2));
            }

            if (modaConv.length == matriz[0].length) {
                modaConv = null;
            }
        }
        modaPearson = parseFloat((3 * mediana - 2 * media).toFixed(2));
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

    console.log("media "+media);
    console.log("mediana "+mediana);
    console.log("moda "+moda);
    console.log("modaConv "+modaConv);
    console.log("moda Pearson "+modaPearson);
    console.log("moda King "+modaKing);
    console.log("moda Czuber "+modaCzuber);
    console.log("Desvio Padrao "+desvioPadrao);
    console.log("CV "+coeficienteVar);

    //Calcula as Separatrizes

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
                    backgroundColor: ["#ff2200","#6A5ACD","#00BFFF","#006400","#DAA520","#9370DB","#1E90FF"],
                    borderWidth: 0
                }
            ]
        },
        options: options
    });

}
