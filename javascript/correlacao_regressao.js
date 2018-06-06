//Função de validação da Correlacao e Regressao
function validacaoCorrRegr() {
    var xHist = [33,25,24,18,12,10,8,4];
    var yHist = [300,400,500,600,700,800,900,1000];
    calcCorr_Regr(xHist,yHist);
}

//Calcula correlação e regressão
function calcCorr_Regr(xHist,yHist){
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
