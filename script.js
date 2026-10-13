/* =========================
   ROBSON BET 777
   SISTEMA DE COINS
========================= */

let coins = 0;


/* =========================
   BOTÃO COMEÇAR A JOGAR
========================= */

function irParaJogos() {

    document
        .getElementById("jogos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   DESAFIO DOS DADOS
========================= */

let somaCorreta = 0;


function jogarDados() {

    const dado1 =
        Math.floor(Math.random() * 6) + 1;

    const dado2 =
        Math.floor(Math.random() * 6) + 1;

    somaCorreta = dado1 + dado2;

    const dados =
        document.getElementById("dados");


    /* Mostra os dados rolando */

    dados.innerHTML = `
        <div class="dado rolando" id="dado1"></div>
        <div class="dado rolando" id="dado2"></div>
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


    /* Depois de 1,5 segundos,
       mostra o resultado */

    setTimeout(function() {

        mostrarDado(
            "dado1",
            dado1
        );

        mostrarDado(
            "dado2",
            dado2
        );


        document.getElementById(
            "area-resposta"
        ).style.display = "block";


        document.getElementById(
            "resposta-dados"
        ).focus();

    }, 1500);

}


/* =========================
   MOSTRAR DADO
========================= */

function mostrarDado(id, numero) {

    const dado =
        document.getElementById(id);


    dado.classList.remove(
        "rolando"
    );


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
                document.createElement(
                    "div"
                );


            ponto.className =
                "ponto";


            ponto.style.gridArea =
                Math.ceil(
                    posicao / 3
                ) +
                " / " +
                (
                    (posicao - 1) % 3 + 1
                );


            dado.appendChild(ponto);

        }
    );

}


/* =========================
   VERIFICAR DADOS
========================= */

function verificarResposta() {

    const campo =
        document.getElementById(
            "resposta-dados"
        );


    const resultado =
        document.getElementById(
            "resultado-dados"
        );


    if (campo.value === "") {

        resultado.innerHTML =
            "⚠️ Digite uma resposta!";

        return;

    }


    const resposta =
        Number(campo.value);


    if (resposta === somaCorreta) {

        coins += somaCorreta;


        atualizarCoins();


        resultado.innerHTML =
            "🎉 <strong>ACERTOU!</strong>" +
            "<br>" +
            "🪙 Você ganhou " +
            somaCorreta +
            " Robson Coins!";

    } else {

        resultado.innerHTML =
            "❌ <strong>ERROU!</strong>" +
            "<br>" +
            "Tente novamente!";

    }

}


/* =========================
   BLACKJACK 21
========================= */

let baralho = [];

let maoJogador = [];

let maoRobson = [];

let blackjackAtivo = false;


/* =========================
   CRIAR BARALHO
========================= */

function criarBaralho() {

    const naipes = [
        "♥",
        "♦",
        "♣",
        "♠"
    ];


    const valores = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K"
    ];


    baralho = [];


    naipes.forEach(
        function(naipe) {

            valores.forEach(
                function(valor) {

                    baralho.push({

                        valor: valor,

                        naipe: naipe

                    });

                }
            );

        }
    );

}


/* =========================
   EMBARALHAR
========================= */

function embaralhar() {

    for (
        let i = baralho.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            baralho[i],
            baralho[j]
        ] = [
            baralho[j],
            baralho[i]
        ];

    }

}


/* =========================
   CALCULAR PONTOS
========================= */

function calcularPontos(mao) {

    let pontos = 0;

    let ases = 0;


    mao.forEach(
        function(carta) {

            if (
                carta.valor === "A"
            ) {

                pontos += 11;

                ases++;

            }

            else if (
                carta.valor === "K" ||
                carta.valor === "Q" ||
                carta.valor === "J"
            ) {

                pontos += 10;

            }

            else {

                pontos +=
                    Number(
                        carta.valor
                    );

            }

        }
    );


    /* Ás pode virar 1
       se passar de 21 */

    while (
        pontos > 21 &&
        ases > 0
    ) {

        pontos -= 10;

        ases--;

    }


    return pontos;

}


/* =========================
   PEGAR CARTA
========================= */

function pegarCarta() {

    return baralho.pop();

}


/* =========================
   MOSTRAR CARTAS
========================= */

function mostrarCartas() {

    const jogador =
        document.getElementById(
            "cartas-jogador"
        );


    const robson =
        document.getElementById(
            "cartas-robson"
        );


    jogador.innerHTML = "";


    maoJogador.forEach(
        function(carta) {

            criarElementoCarta(
                jogador,
                carta
            );

        }
    );


    robson.innerHTML = "";


    maoRobson.forEach(
        function(carta, index) {

            /* Segunda carta
               do Robson fica escondida */

            if (
                index === 1 &&
                blackjackAtivo
            ) {

                const cartaElement =
                    document.createElement(
                        "div"
                    );


                cartaElement.className =
                    "carta escondida";


                cartaElement.textContent =
                    "?";


                robson.appendChild(
                    cartaElement
                );

            }

            else {

                criarElementoCarta(
                    robson,
                    carta
                );

            }

        }
    );


    document.getElementById(
        "pontos-jogador"
    ).textContent =
        "Pontos: " +
        calcularPontos(
            maoJogador
        );


    if (blackjackAtivo) {

        document.getElementById(
            "pontos-robson"
        ).textContent =
            "Pontos: ?";

    }

    else {

        document.getElementById(
            "pontos-robson"
        ).textContent =
            "Pontos: " +
            calcularPontos(
                maoRobson
            );

    }

}


/* =========================
   CRIAR CARTA VISUAL
========================= */

function criarElementoCarta(
    container,
    carta
) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "carta";


    if (
        carta.naipe === "♥" ||
        carta.naipe === "♦"
    ) {

        elemento.classList.add(
            "vermelha"
        );

    }


    elemento.textContent =
        carta.valor +
        carta.naipe;


    container.appendChild(
        elemento
    );

}


/* =========================
   INICIAR BLACKJACK
========================= */

function iniciarBlackjack() {

    criarBaralho();

    embaralhar();


    maoJogador = [];

    maoRobson = [];


    blackjackAtivo = true;


    /* Duas cartas para cada */

    maoJogador.push(
        pegarCarta()
    );

    maoJogador.push(
        pegarCarta()
    );


    maoRobson.push(
        pegarCarta()
    );

    maoRobson.push(
        pegarCarta()
    );


    document.getElementById(
        "resultado-blackjack"
    ).innerHTML = "";


    document.getElementById(
        "pedir-carta"
    ).disabled = false;


    document.getElementById(
        "parar-blackjack"
    ).disabled = false;


    mostrarCartas();


    verificarBlackjackInicial();

}


/* =========================
   PEDIR CARTA
========================= */

function pedirCarta() {

    if (!blackjackAtivo) {

        return;

    }


    maoJogador.push(
        pegarCarta()
    );


    mostrarCartas();


    const pontos =
        calcularPontos(
            maoJogador
        );


    /* Passou de 21 */

    if (pontos > 21) {

        finalizarBlackjack(
            "💥 Você estourou! Mais de 21."
        );

        return;

    }


    /* Chegou exatamente a 21 */

    if (pontos === 21) {

        pararBlackjack();

    }

}


/* =========================
   PARAR
========================= */

function pararBlackjack() {

    if (!blackjackAtivo) {

        return;

    }


    blackjackAtivo = false;


    /* Robson compra até chegar
       a pelo menos 17 */

    while (
        calcularPontos(
            maoRobson
        ) < 17
    ) {

        maoRobson.push(
            pegarCarta()
        );

    }


    mostrarCartas();


    compararMaos();

}


/* =========================
   COMPARAR MÃOS
========================= */

function compararMaos() {

    const jogador =
        calcularPontos(
            maoJogador
        );


    const robson =
        calcularPontos(
            maoRobson
        );


    let mensagem = "";


    if (robson > 21) {

        mensagem =
            "🎉 Robson estourou! " +
            "Você venceu! +10 Robson Coins";

        coins += 10;

    }

    else if (jogador > robson) {

        mensagem =
            "🎉 Você venceu! " +
            "+10 Robson Coins";

        coins += 10;

    }

    else if (jogador === robson) {

        mensagem =
            "🤝 Empate!";

    }

    else {

        mensagem =
            "🤖 Robson venceu!";

    }


    atualizarCoins();


    document.getElementById(
        "resultado-blackjack"
    ).innerHTML =
        mensagem;


    desativarBotoes();

}


/* =========================
   BLACKJACK INICIAL
========================= */

function verificarBlackjackInicial() {

    const jogador =
        calcularPontos(
            maoJogador
        );


    if (jogador !== 21) {

        return;

    }


    blackjackAtivo = false;


    const robson =
        calcularPontos(
            maoRobson
        );


    mostrarCartas();


    if (robson === 21) {

        document.getElementById(
            "resultado-blackjack"
        ).innerHTML =
            "🤝 Os dois fizeram Blackjack!";

    }

    else {

        coins += 15;


        atualizarCoins();


        document.getElementById(
            "resultado-blackjack"
        ).innerHTML =
            "🃏 BLACKJACK! " +
            "+15 Robson Coins";

    }


    desativarBotoes();

}


/* =========================
   FINALIZAR BLACKJACK
========================= */

function finalizarBlackjack(
    mensagem
) {

    blackjackAtivo = false;


    mostrarCartas();


    document.getElementById(
        "resultado-blackjack"
    ).innerHTML =
        mensagem;


    desativarBotoes();

}


/* =========================
   DESATIVAR BOTÕES
========================= */

function desativarBotoes() {

    document.getElementById(
        "pedir-carta"
    ).disabled = true;


    document.getElementById(
        "parar-blackjack"
    ).disabled = true;

}


/* =========================
   ATUALIZAR COINS
========================= */

function atualizarCoins() {

    document.getElementById(
        "coin-count"
    ).textContent =
        coins;

}


/* =========================================
   ROLETA ROBSON
========================================= */

let corRoletaEscolhida = "";

let roletaGirando = false;

let roletaRotacao = 0;


/* =========================================
   ESCOLHER COR DA ROLETA
========================================= */

function escolherCorRoleta(cor) {

    corRoletaEscolhida = cor;


    const botoes =
        document.querySelectorAll(
            ".roleta-cor"
        );


    botoes.forEach(
        function(botao) {

            botao.classList.remove(
                "selecionada"
            );

        }
    );


    if (cor === "vermelho") {

        const botaoVermelho =
            document.querySelector(
                ".roleta-cor.vermelho"
            );


        if (botaoVermelho) {

            botaoVermelho.classList.add(
                "selecionada"
            );

        }

    }


    if (cor === "preto") {

        const botaoPreto =
            document.querySelector(
                ".roleta-cor.preto"
            );


        if (botaoPreto) {

            botaoPreto.classList.add(
                "selecionada"
            );

        }

    }


    const resultado =
        document.getElementById(
            "resultado-roleta"
        );


    if (resultado) {

        resultado.innerHTML =
            "🎯 Cor escolhida: " +
            cor +
            "<br>" +
            "Agora gire a roleta!";

    }

}


/* =========================================
   GIRAR ROLETA
========================================= */

function girarRoleta() {

    if (roletaGirando) {

        return;

    }


    if (!corRoletaEscolhida) {

        const resultado =
            document.getElementById(
                "resultado-roleta"
            );


        if (resultado) {

            resultado.innerHTML =
                "⚠️ Escolha uma cor primeiro!";

        }


        return;

    }


    const roleta =
        document.getElementById(
            "roleta"
        );


    const resultado =
        document.getElementById(
            "resultado-roleta"
        );


    if (!roleta || !resultado) {

        return;

    }


    roletaGirando = true;


    resultado.innerHTML =
        "🎡 A roleta está girando...";


    /* Número de 0 até 36 */

    const numero =
        Math.floor(
            Math.random() * 37
        );


    /* Números vermelhos */

    const vermelhos = [

        1,
        3,
        5,
        7,
        9,
        12,
        14,
        16,
        18,
        19,
        21,
        23,
        25,
        27,
        30,
        32,
        34,
        36

    ];


    let corResultado;


    if (numero === 0) {

        corResultado = "verde";

    }

    else if (
        vermelhos.includes(numero)
    ) {

        corResultado = "vermelho";

    }

    else {

        corResultado = "preto";

    }


    /* Faz a roleta girar */

    const voltas =
        5 +
        Math.floor(
            Math.random() * 3
        );


    const graus =
        Math.floor(
            Math.random() * 360
        );


    roletaRotacao +=
        voltas * 360 +
        graus;


    roleta.style.transform =
        "rotate(" +
        roletaRotacao +
        "deg)";


    /* Espera a animação */

    setTimeout(
        function() {

            roletaGirando = false;


            /* ACERTOU */

            if (
                corResultado ===
                corRoletaEscolhida
            ) {

                coins += 5;


                atualizarCoins();


                resultado.innerHTML =
                    "🎉 <strong>ACERTOU!</strong>" +
                    "<br>" +
                    "A roleta caiu no número " +
                    numero +
                    " (" +
                    corResultado +
                    ")" +
                    "<br>" +
                    "🪙 +5 Robson Coins!";

            }


            /* ZERO */

            else if (
                corResultado ===
                "verde"
            ) {

                resultado.innerHTML =
                    "🟢 A roleta caiu no ZERO!" +
                    "<br>" +
                    "Número: 0";

            }


            /* ERROU */

            else {

                resultado.innerHTML =
                    "🎡 Resultado: " +
                    numero +
                    " (" +
                    corResultado +
                    ")" +
                    "<br>" +
                    "Não foi a cor escolhida.";

            }

        },
        4200
    );

}

/* =========================================
   SISTEMA DE APELIDO
========================================= */

let apelidoJogador = "";


/* =========================
   ENTRAR NO JOGO
========================= */

function entrarNoJogo() {

    const campo =
        document.getElementById("apelido");

    const tela =
        document.getElementById("tela-apelido");


    if (!campo || !tela) {

        return;

    }


    const apelido =
        campo.value.trim();


    /* Não deixa entrar vazio */

    if (apelido === "") {

        alert(
            "⚠️ Digite um apelido para continuar!"
        );

        campo.focus();

        return;

    }


    /* Salva o apelido */

    apelidoJogador =
        apelido;


    localStorage.setItem(
        "robsonJogadorAtual",
        apelidoJogador
    );


    /* Fecha a tela */

    tela.style.display = "none";


    console.log(
        "Jogador:",
        apelidoJogador
    );

}


/* =========================================
   CARREGAR APELIDO AO ABRIR O SITE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const apelidoSalvo =
            localStorage.getItem(
                "robsonJogadorAtual"
            );


        const tela =
            document.getElementById(
                "tela-apelido"
            );


        const campo =
            document.getElementById(
                "apelido"
            );


        /* Se já existe apelido,
           entra automaticamente */

        if (
            apelidoSalvo &&
            apelidoSalvo.trim() !== ""
        ) {

            apelidoJogador =
                apelidoSalvo;


            if (tela) {

                tela.style.display =
                    "none";

            }

        }

        else {

            /* Primeiro acesso:
               mostra a tela */

            if (tela) {

                tela.style.display =
                    "flex";

            }

        }


        /* Pressionar Enter também entra */

        if (campo) {

            campo.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        entrarNoJogo();

                    }

                }
            );

        }


        atualizarCoins();

    }
);
