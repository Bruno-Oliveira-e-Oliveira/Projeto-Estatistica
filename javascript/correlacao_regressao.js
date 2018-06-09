//Função de validação da Correlacao e Regressao
function validacaoCorrRegr() {
    xHist = document.getElementById("txtX").value;
    yHist = document.getElementById("txtY").value;

    if (xHist == "" || yHist == "") {
        alert("Preencha todos os campos!!");
        return 0;
    }
    xHist = xHist.split(";");
    yHist = yHist.split(";");

    if (xHist.length != yHist.length) {
        alert("A quantidade de variáveis de X e Y são diferentes, verifique os dados fornecidos.");
        return 0;
    }

    for (var i = 0; i < xHist.length; i++) {
        xHist[i] = Number(xHist[i]);
        yHist[i] = Number(yHist[i]);
    }


    //xHist = [33,25,24,18,12,10,8,4];
    //yHist = [300,400,500,600,700,800,900,1000];


    calcCorr_Regr();

    document.getElementById("txtX").value = "";
    document.getElementById("txtY").value = "";
    document.getElementById("btnCorrReg").disabled = true;
    document.getElementById("btnInserirDados").disabled = false;
    document.getElementById("txtX").placeholder = "Insira apenas um dado de cada vez, em apenas um dos dois campos."
    document.getElementById("txtY").placeholder = "Insira apenas um dado de cada vez, em apenas um dos dois campos."
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
    var nAmostras = matrizHist[0].length;
    var eqReta;
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
    gerarGraficoReg();

    document.getElementById("labelCoefL").innerHTML = coefLinear;
    document.getElementById("labelEqReta").innerHTML = eqReta;
    document.getElementById("saidaCorrRegr").style = "display: block;";
}

//Gera o grafico da regressao
function gerarGraficoReg(){
    var ctx = document.getElementById('grafReg').getContext('2d');
    var dataS = [];
    var dataL = [];
    maiorRegr = yHist[0];
    menorRegr = yHist[0];

    for (var i = 0; i < xHist.length; i++) {
        dataS.push({
            x: xHist[i],
            y: yHist[i]
        });
        if (maiorRegr < yHist[i]) {
            maiorRegr = yHist[i];
        }
        if (menorRegr > yHist[i]) {
            menorRegr = yHist[i];
        }
    }

    dataL = [{
        x:(menorRegr - b) /a, y: menorRegr
    },{
        x:(maiorRegr - b) /a, y: maiorRegr
    }]

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


function inserirDados(){
    var x = document.getElementById("txtX").value;
    var y = document.getElementById("txtY").value;
    x = x.split(";");
    y = y.split(";");

    if ((x == "" && y == "") || (x != "" && y != "")) {
        alert("Preencha apenas um dos campos, para que seja realizado o cálculo.");
        return 0;
    }else if (x.length > 1 || y.length > 1) {
        alert("Digite apenas um número.");
        return 0;
    }else if (x != "") {
        x = Number(x[0]);
        y = a * x + b;
    }else if (y != "") {
        y = Number(y[0]);
        x = (y - b)/a
        x = parseFloat(x.toFixed(2));
    }

    xHist.push(x);
    yHist.push(y);
    document.getElementById("txtX").value = "";
    document.getElementById("txtY").value = "";
    gerarGraficoReg();
}
