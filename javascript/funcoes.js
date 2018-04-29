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

    //1° Passo: Amplitude
    var amp = dados[dados.length-1] - dados[0];

    //2° Passo: Classes
    var classes = [];
    classes.push(parseInt(Math.sqrt(dados.length)));
    classes.unshift(classes[0]-1);
    classes.push(classes[1]+1);

    //3° Passo: Intervalo
    var continuar = true;
    var classe = 0;

    do {
        amp++;

        for (var i = 0; i < classes.length; i++) {
            if (amp % classes[i] == 0) {
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

    if (tipoVar == "CNT") {
        varPesq = [];
        fi = [];
        mat = calcularVarContinua();
    } else {
        var contfi = 0;
        var cont = 0;

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
    var somaFi = sum(fi);
    var num = 0;
    var soma;

    fac.push(fi[0]);

    for (var i = 0; i < fi.length; i++) {
        frP.push(parseFloat(((fi[i]/ somaFi)*100).toFixed(2)));
        soma = frP[i] + num;
        facP.push(parseFloat(soma.toFixed(2)));
        num = facP[i];
        if (i < fi.length -1) {
            fac.push(fac[i] + fi[i+1]);
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
