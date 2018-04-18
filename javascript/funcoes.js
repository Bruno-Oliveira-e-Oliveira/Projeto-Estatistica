//Funcao para identificar se os dados sao Qualitativos ou Quantitativos
function identificarTipoVar(dados){
    dados = dados.split(";");

    if (isNaN(Number(dados[0]))) {
        tipoVar = "QL";
        dados = dados.sort();
    } else {
        tipoVar = "QT";
        for (var i = 0; i < dados.length; i++) {
            dados[i] = Number(dados[i]);
        }
    }

    return dados;
}


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

    return [classes,varIni,varFim];

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

    //Caso a variavel seja continua
    if(varPesq.length > 10){
        tipoVar = "CNT";
        varPesq = [];
        fi = [];
        varPesq = calcularVarContinua();
    }else {
        tipoVar = "DSC";
    }

    //Calcular frequencia relativa percentual, acumulada e acumulada percentual
    var somaFi = sum(fi);
    var num = 0;

    fac.push(fi[0]);

    for (var i = 0; i < fi.length; i++) {
        frP.push(Math.round((fi[i]/ somaFi)*100));
        facP.push(frP[i] + num);
        num = facP[i];
        if (i < fi.length -1) {
            fac.push(fac[i] + fi[i+1]);
        }
    }

    return [varPesq,fi,frP,fac,facP];
}

// Gerador de tabela

function gerarTabela(){
    
}
