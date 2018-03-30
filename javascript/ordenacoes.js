var dados = "5;9;1;-89;69856;3;5;8;1;5;7;8;2;3;2;5;2";

function ordenarQtt(dados){
    var ordenado = false;
    dados = dados.split(";");

    for (var i = 0;i < dados.length; i++) {
        dados[i] = parseInt(dados[i]);
    }

    while (!ordenado) {
        var aux;

        for (var i = 0; i < dados.length; i++) {
            if (i == (dados.length-1)) {
                ordenado = true;
                break;
            }

            if (dados[i] > dados[i+1]) {
                aux = dados[i+1];
                dados[i+1] = dados[i];
                dados[i] = aux;
                break;
            }
        }
    }


    document.write(dados);
}


ordenarQtt(dados);
