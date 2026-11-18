// =============================================
// Na Mesa - script.js
// Todo o JavaScript do site fica neste arquivo.
// Como ele é carregado em todas as páginas, cada parte
// só funciona se o elemento existir na página.
// =============================================


// ---------- 1. MENU HAMBÚRGUER (todas as páginas) ----------
const botaoMenu = document.getElementById("botao-menu");
const menu = document.getElementById("menu");

if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
        // toggle coloca a classe se ela não existe e tira se já existe
        menu.classList.toggle("aberto");
        // avisa o leitor de tela se o menu está aberto ou fechado
        botaoMenu.setAttribute("aria-expanded", menu.classList.contains("aberto"));
    });
}


// ---------- 2. ACORDEÃO DA FAQ (faq.html) ----------
// querySelectorAll devolve uma lista vazia nas outras páginas,
// então o forEach simplesmente não faz nada nelas
const perguntas = document.querySelectorAll(".pergunta");

perguntas.forEach(function (pergunta) {
    pergunta.addEventListener("click", function () {
        // a resposta é o elemento que vem logo depois do botão
        const resposta = pergunta.nextElementSibling;
        resposta.classList.toggle("aberta");
        pergunta.classList.toggle("ativa");
    });
});


// ---------- 3. ABAS (como-funciona.html) ----------
const botoesAba = document.querySelectorAll(".botao-aba");
const paineis = document.querySelectorAll(".painel");

botoesAba.forEach(function (botao) {
    botao.addEventListener("click", function () {
        // primeiro esconde todos os painéis e tira o destaque dos botões
        paineis.forEach(function (painel) {
            painel.classList.remove("visivel");
        });
        botoesAba.forEach(function (outroBotao) {
            outroBotao.classList.remove("ativa");
        });

        // depois mostra só o painel com o id igual ao data-aba do botão
        const nomeDoPainel = botao.dataset.aba;
        document.getElementById(nomeDoPainel).classList.add("visivel");
        botao.classList.add("ativa");
    });
});


// ---------- 4. PONTOS DE COLETA: ocupação, filtro e busca (pontos.html) ----------
// cada card guarda os dados do ponto nos atributos data- (data-bairro, data-capacidade...)
const filtroBairro = document.getElementById("filtro-bairro");
const campoBusca = document.getElementById("busca");
const pontos = document.querySelectorAll(".ponto");
const resultado = document.getElementById("resultado");

// calcula quanto da capacidade do ponto já está ocupado, em porcentagem
function calcularOcupacao(ponto) {
    const capacidade = Number(ponto.dataset.capacidade);
    const ocupado = Number(ponto.dataset.ocupado);
    return Math.round(ocupado / capacidade * 100);
}

// escreve a porcentagem e enche a barra de cada card
function mostrarOcupacao() {
    pontos.forEach(function (ponto) {
        ponto.querySelector(".porcentagem").textContent = calcularOcupacao(ponto) + "%";

        const barra = ponto.querySelector("meter");
        barra.max = Number(ponto.dataset.capacidade);
        barra.value = Number(ponto.dataset.ocupado);
    });
}

// mostra só os pontos do bairro escolhido que têm o nome buscado
function filtrarPontos() {
    const bairroEscolhido = filtroBairro.value;
    const textoBusca = campoBusca.value.trim().toLowerCase();
    let quantidade = 0;

    pontos.forEach(function (ponto) {
        const nome = ponto.querySelector("h3").textContent.toLowerCase();
        const bairroCerto = bairroEscolhido === "todos" || ponto.dataset.bairro === bairroEscolhido;
        const nomeCerto = nome.includes(textoBusca);

        if (bairroCerto && nomeCerto) {
            ponto.classList.remove("escondido");
            quantidade++;
        } else {
            ponto.classList.add("escondido");
        }
    });

    if (quantidade === 0) {
        resultado.textContent = "Nenhum ponto encontrado. Tente outro bairro ou outro nome.";
    } else {
        resultado.textContent = quantidade + " ponto(s) encontrado(s)";
    }
}

if (filtroBairro) {
    mostrarOcupacao();
    // "change" acontece quando troca o bairro; "input" a cada letra digitada
    filtroBairro.addEventListener("change", filtrarPontos);
    campoBusca.addEventListener("input", filtrarPontos);
}


// ---------- 5. JANELA DE DETALHES DO PONTO (pontos.html) ----------
const modal = document.getElementById("modal");
const botoesDetalhes = document.querySelectorAll(".botao-detalhes");

// preenche a janela com os dados do ponto e mostra ela na tela
function abrirDetalhes(ponto) {
    const capacidade = Number(ponto.dataset.capacidade);
    const ocupado = Number(ponto.dataset.ocupado);

    document.getElementById("modal-nome").textContent = ponto.querySelector("h3").textContent;
    document.getElementById("modal-bairro").textContent = ponto.dataset.bairro;
    document.getElementById("modal-endereco").textContent = ponto.dataset.endereco;
    document.getElementById("modal-horario").textContent = ponto.dataset.horario;
    document.getElementById("modal-responsavel").textContent = ponto.dataset.responsavel;
    document.getElementById("modal-capacidade").textContent = capacidade + " kg";
    document.getElementById("modal-ocupado").textContent = ocupado + " kg (" + calcularOcupacao(ponto) + "%)";
    document.getElementById("modal-livre").textContent = (capacidade - ocupado) + " kg";

    modal.classList.add("aberto");
}

function fecharDetalhes() {
    modal.classList.remove("aberto");
}

botoesDetalhes.forEach(function (botao) {
    botao.addEventListener("click", function () {
        // closest acha o card do ponto onde o botão está
        abrirDetalhes(botao.closest(".ponto"));
    });
});

if (modal) {
    document.getElementById("modal-fechar").addEventListener("click", fecharDetalhes);

    // clicar no fundo escuro, fora da caixa, também fecha
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            fecharDetalhes();
        }
    });

    // a tecla Esc também fecha
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharDetalhes();
        }
    });
}


// ---------- 6. VALIDAÇÃO DO FORMULÁRIO (contato.html) ----------
const formulario = document.getElementById("form-contato");

// mostra a mensagem de erro embaixo do campo e deixa a borda vermelha
function mostrarErro(campo, mensagem) {
    campo.classList.add("campo-erro");
    campo.classList.remove("campo-ok");
    document.getElementById("erro-" + campo.id).textContent = mensagem;
}

// tira a mensagem de erro e a borda vermelha, e deixa a borda verde (campo certo)
function limparErro(campo) {
    campo.classList.remove("campo-erro");
    campo.classList.add("campo-ok");
    document.getElementById("erro-" + campo.id).textContent = "";
}

// o e-mail precisa ter algo antes do @ e um ponto depois dele
function emailValido(email) {
    const posicaoArroba = email.indexOf("@");
    const posicaoPonto = email.lastIndexOf(".");

    if (posicaoArroba < 1) {
        return false;
    }
    // não pode ter espaço
    if (email.indexOf(" ") !== -1) {
        return false;
    }
    // só pode ter um @
    if (posicaoArroba !== email.lastIndexOf("@")) {
        return false;
    }
    if (posicaoPonto < posicaoArroba + 2) {
        return false;
    }
    if (posicaoPonto === email.length - 1) {
        return false;
    }
    return true;
}

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        // impede o formulário de recarregar a página
        evento.preventDefault();

        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const assunto = document.getElementById("assunto");
        const mensagem = document.getElementById("mensagem");
        const sucesso = document.getElementById("mensagem-sucesso");

        let tudoCerto = true;
        sucesso.classList.remove("mostrar");

        if (nome.value.trim() === "") {
            mostrarErro(nome, "Preencha o seu nome.");
            tudoCerto = false;
        } else {
            limparErro(nome);
        }

        if (email.value.trim() === "") {
            mostrarErro(email, "Preencha o seu e-mail.");
            tudoCerto = false;
        } else if (!emailValido(email.value.trim())) {
            mostrarErro(email, "Digite um e-mail válido, como nome@email.com.");
            tudoCerto = false;
        } else {
            limparErro(email);
        }

        if (assunto.value === "") {
            mostrarErro(assunto, "Escolha um assunto.");
            tudoCerto = false;
        } else {
            limparErro(assunto);
        }

        if (mensagem.value.trim() === "") {
            mostrarErro(mensagem, "Escreva a sua mensagem.");
            tudoCerto = false;
        } else {
            limparErro(mensagem);
        }

        // só mostra o sucesso se nenhum campo tiver erro
        if (tudoCerto) {
            sucesso.textContent = "Mensagem enviada com sucesso! Obrigado, " + nome.value.trim() + ".";
            sucesso.classList.add("mostrar");
            formulario.reset();
            // depois de enviar, os campos voltam ao visual normal
            nome.classList.remove("campo-ok");
            email.classList.remove("campo-ok");
            assunto.classList.remove("campo-ok");
            mensagem.classList.remove("campo-ok");
        }
    });
}


// ---------- 7. SIMULADOR DE PRIORIDADE (simulador.html) ----------
// usa a mesma regra do método calcularPrioridade() do projeto em Java
const formSimulador = document.getElementById("form-simulador");

// lê um campo de número; se estiver vazio ou negativo, vale 0
function lerNumero(id) {
    const valor = Number(document.getElementById(id).value);
    if (isNaN(valor) || valor < 0) {
        return 0;
    }
    return valor;
}

function calcularPrioridade() {
    const faixa = document.getElementById("sim-renda").value;
    const pessoas = lerNumero("sim-pessoas");
    const criancas = lerNumero("sim-criancas");
    const idosos = lerNumero("sim-idosos");
    const dias = lerNumero("sim-dias");
    const convites = lerNumero("sim-convites");
    const retiradas = lerNumero("sim-retiradas");
    const erro = document.getElementById("sim-erro");

    // confere se os dados fazem sentido antes de calcular
    if (pessoas < 1) {
        erro.textContent = "A família precisa ter pelo menos 1 pessoa.";
        return;
    }
    if (criancas + idosos > pessoas) {
        erro.textContent = "Crianças e idosos não podem passar do total de pessoas na casa.";
        return;
    }
    if (retiradas > convites) {
        erro.textContent = "As retiradas não podem ser maiores que os convites recebidos.";
        return;
    }
    erro.textContent = "";

    // 1) faixa de renda: até 40 pontos
    let pontosRenda = 12;
    if (faixa === "1") {
        pontosRenda = 40;
    } else if (faixa === "2") {
        pontosRenda = 24;
    }

    // 2) tamanho da família: até 25 pontos
    // crianças e idosos valem meio ponto a mais, e o máximo é 10
    let tamanho = pessoas + criancas * 0.5 + idosos * 0.5;
    if (tamanho > 10) {
        tamanho = 10;
    }
    const pontosTamanho = tamanho / 10 * 25;

    // 3) dias sem receber: até 25 pontos, contando no máximo 30 dias
    let diasContados = dias;
    if (diasContados > 30) {
        diasContados = 30;
    }
    const pontosDias = diasContados / 30 * 25;

    // 4) comparecimento: até 10 pontos
    // quem nunca foi convidada ganha os 10, porque nunca teve chance de faltar
    let pontosComparecimento = 10;
    if (convites > 0) {
        pontosComparecimento = retiradas / convites * 10;
    }

    const nota = pontosRenda + pontosTamanho + pontosDias + pontosComparecimento;

    // texto que explica a nota
    let nivel = "Prioridade baixa";
    if (nota >= 75) {
        nivel = "Prioridade muito alta";
    } else if (nota >= 50) {
        nivel = "Prioridade alta";
    } else if (nota >= 30) {
        nivel = "Prioridade média";
    }

    // mostra o resultado na tela, com uma casa depois da vírgula
    document.getElementById("nota").textContent = nota.toFixed(1);
    document.getElementById("nivel").textContent = nivel;
    document.getElementById("barra-nota").value = nota;
    document.getElementById("parte-renda").textContent = pontosRenda.toFixed(1);
    document.getElementById("parte-tamanho").textContent = pontosTamanho.toFixed(1);
    document.getElementById("parte-dias").textContent = pontosDias.toFixed(1);
    document.getElementById("parte-comparecimento").textContent = pontosComparecimento.toFixed(1);
}

if (formSimulador) {
    // recalcula a cada número digitado ou opção trocada
    formSimulador.addEventListener("input", calcularPrioridade);

    // o Enter não deve recarregar a página
    formSimulador.addEventListener("submit", function (evento) {
        evento.preventDefault();
    });

    // o botão Limpar volta os valores iniciais e calcula de novo
    document.getElementById("botao-limpar").addEventListener("click", function () {
        formSimulador.reset();
        calcularPrioridade();
    });

    // calcula a nota assim que a página abre
    calcularPrioridade();
}
