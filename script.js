let jogadores =
    JSON.parse(localStorage.getItem("robsonJogadores")) || [];

let jogadorAtual =
    localStorage.getItem("robsonJogadorAtual") || "";

let coins = 0;

let somaCorreta = 0;


// ===============================
// ENTRAR NO JOGO
// ===============================

function entrarNoJogo() {

    const input = document.getElementById("apelido");
    const apelido = input.value.trim();

    if (apelido === "") {

        alert("Digite um apelido!");

        return;
    }


    // Procura jogador existente

    let jogador = jogadores.find(function(jogador) {

        return jogador.nome.toLowerCase() === apelido.toLowerCase();

    });


    // Cria jogador novo

    if (!jogador) {

        jogador = {

            nome: apelido,

            pontos: 0,

            historico: []

        };

        jogadores.push(jogador);

    }


    // Define jogador atual

    jogadorAtual = jogador.nome;

    coins = jogador.pontos;


    // Salva jogador atual

    localStorage.setItem(
        "robsonJogadorAtual",
        jogadorAtual
    );


    // Salva jogadores

    localStorage.setItem(
        "robsonJogadores",
        JSON.stringify(jogadores)
    );


    // Fecha tela de apelido

    document.getElementById(
        "tela-apelido"
    ).style.display = "none";


    // Atualiza Coins

    document.getElementById(
        "coin-count"
    ).textContent = coins;


    // Atualiza ranking

    atualizarRanking();


    // Mostra histórico

    mostrarHistorico();

}


// ===============================
// IR PARA OS JOGOS
// ===============================

function irParaJogos() {

    document
        .getElementById("jogos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// DESAFIO DOS DADOS
// ===============================

function jogarDados() {

    const dado1 =
        Math.floor(Math.random() * 6) + 1;

    const dado2 =
        Math.floor(Math.random() * 6) + 1;

    somaCorreta = dado1 + dado2;


    const dados =
        document.getElementById("dados");


    dados.innerHTML = `

        <div
            class="dado rolando"
            id="dado1">
        </div>

        <div
            class="dado rolando"
            id="dado2">
        </div>

    `;


    document.getElementById(
        "area-resposta"
    ).style.display = "none";


    document.getElementById(
        "resultado-dados"
    ).innerHTML = "";


    document.getElementById(
        "resposta-dados"
    ).value = "";


    // Animação dos dados

    setTimeout(function() {

        mostrarDado("dado1", dado1);

        mostrarDado("dado2", dado2);


        document.getElementById(
            "area-resposta"
        ).style.display = "block";


        document.getElementById(
            "resposta-dados"
        ).focus();

    }, 1500);


    function mostrarDado(id, numero) {

        const dado =
            document.getElementById(id);


        dado.classList.remove("rolando");


        const combinacoes = {

            1: [4],

            2: [1, 9],

            3: [1, 4, 9],

            4: [1, 3, 7, 9],

            5: [1, 3, 4, 7, 9],

            6: [1, 3, 4, 6, 7, 9]

        };


        dado.innerHTML = "";


        combinacoes[numero].forEach(
            function(posicao) {

                const ponto =
                    document.createElement("div");


                ponto.className =
                    "ponto";


                ponto.style.gridArea =
                    Math.ceil(posicao / 3) +
                    " / " +
                    ((posicao - 1) % 3 + 1);


                dado.appendChild(ponto);

            }
        );

    }

}


// ===============================
// VERIFICAR RESPOSTA
// ===============================

function verificarResposta() {

    const campo =
        document.getElementById(
            "resposta-dados"
        );


    const resposta =
        Number(campo.value);


    const resultado =
        document.getElementById(
            "resultado-dados"
        );


    if (campo.value === "") {

        resultado.innerHTML =
            "⚠️ Digite uma resposta!";

        return;

    }


    // RESPOSTA CERTA

    if (resposta === somaCorreta) {

        coins += somaCorreta;


        const jogador =
            jogadores.find(function(jogador) {

                return jogador.nome === jogadorAtual;

            });


        if (jogador) {

            jogador.pontos += somaCorreta;


            // Garante que o histórico exista

            if (!jogador.historico) {

                jogador.historico = [];

            }


            // Adiciona ao histórico

            jogador.historico.push({

                jogo: "Desafio dos Dados",

                pontos: somaCorreta,

                data: new Date().toLocaleString("pt-BR")

            });

        }


        // Salva os dados

        localStorage.setItem(
            "robsonJogadores",
            JSON.stringify(jogadores)
        );


        // Atualiza Coins

        document.getElementById(
            "coin-count"
        ).textContent = coins;


        // Atualiza ranking

        atualizarRanking();


        // Atualiza histórico

        mostrarHistorico();


        resultado.innerHTML =

            "🎉 <strong>ACERTOU!</strong>" +

            "<br>" +

            "🪙 Você ganhou " +

            somaCorreta +

            " Robson Coins!";

    }


    // RESPOSTA ERRADA

    else {

        resultado.innerHTML =

            "❌ <strong>ERROU!</strong>" +

            "<br>" +

            "Tente novamente!";

    }

}


// ===============================
// RANKING
// ===============================

function atualizarRanking() {

    jogadores.sort(
        (a, b) => b.pontos - a.pontos
    );


    const rankingList =
        document.querySelector(
            ".ranking-list"
        );


    if (!rankingList) {

        return;

    }


    rankingList.innerHTML = "";


    jogadores.forEach(
        function(jogador, index) {

            let posicao;


            if (index === 0) {

                posicao = "🥇";

            }

            else if (index === 1) {

                posicao = "🥈";

            }

            else if (index === 2) {

                posicao = "🥉";

            }

            else {

                posicao =
                    (index + 1) + "º";

            }


            rankingList.innerHTML += `

                <div class="ranking-player">

                    <span class="position">
                        ${posicao}
                    </span>

                    <span class="player-name">
                        ${jogador.nome}
                    </span>

                    <span class="player-points">
                        ${jogador.pontos}
                    </span>

                </div>

            `;

        }
    );

}


// ===============================
// MOSTRAR HISTÓRICO
// ===============================

function mostrarHistorico() {

    const lista =
        document.getElementById(
            "lista-historico"
        );


    if (!lista) {

        return;

    }


    const jogador =
        jogadores.find(function(jogador) {

            return jogador.nome === jogadorAtual;

        });


    if (
        !jogador ||
        !jogador.historico ||
        jogador.historico.length === 0
    ) {

        lista.innerHTML = `

            <p style="
                text-align:center;
                color:#777;
            ">

                Você ainda não tem partidas
                no histórico.

            </p>

        `;

        return;

    }


    lista.innerHTML = "";


    jogador.historico
        .slice()
        .reverse()
        .forEach(function(partida) {

            lista.innerHTML += `

                <div class="item-historico">

                    <div>

                        <div class="nome-jogo">

                            🎲 ${partida.jogo}

                        </div>


                        <div class="data-historico">

                            ${partida.data}

                        </div>

                    </div>


                    <div class="pontos-historico">

                        +${partida.pontos} 🪙

                    </div>

                </div>

            `;

        });

}


// ===============================
// INICIAR RANKING
// ===============================

atualizarRanking();