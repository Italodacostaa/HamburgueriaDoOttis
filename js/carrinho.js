// ================================
// CARRINHO.JS - HAMBURGUERIA DO OTTIS
// ================================

// ================================
// ESTADO
// ================================
let carrinho = JSON.parse(localStorage.getItem('carrinhoOttis')) || [];

// ================================
// DOM
// ================================
let abrirCarrinhoBtnDesktop;
let abrirCarrinhoBtnMobile;
let contadorCarrinhoDesktop;
let contadorCarrinhoMobile;
let carrinhoModal;
let fecharCarrinhoBtn;
let itensCarrinhoContainer;
let carrinhoTotalSpan;
let mensagemCarrinhoVazio;
let btnFinalizarPedido;

// Checkout
let checkoutModal;
let checkoutItensContainer;
let checkoutTotalSpan;
let btnConfirmarPedido;
let btnCancelarPedido;


// ================================
// UTIL
// ================================

function salvarCarrinho() {
    localStorage.setItem('carrinhoOttis', JSON.stringify(carrinho));
}

function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function calcularTotalItens() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

// ================================
// HEADER
// ================================

function atualizarContadorCarrinhoHeader() {
    const total = calcularTotalItens();

    const atualizar = (el) => {
        if (!el) return;
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';

        el.classList.remove('animar');
        if (total > 0) {
            void el.offsetWidth;
            el.classList.add('animar');
        }
    };

    atualizar(contadorCarrinhoDesktop);
    atualizar(contadorCarrinhoMobile);
}

// ================================
// RENDER
// ================================

function renderizarCarrinho() {
    if (!itensCarrinhoContainer || !carrinhoTotalSpan || !mensagemCarrinhoVazio) return;

    itensCarrinhoContainer.innerHTML = '';

    if (carrinho.length === 0) {
        mensagemCarrinhoVazio.style.display = 'block';
        btnFinalizarPedido && (btnFinalizarPedido.disabled = true);
    } else {
        mensagemCarrinhoVazio.style.display = 'none';
        btnFinalizarPedido && (btnFinalizarPedido.disabled = false);

        carrinho.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('carrinho-item');

            div.innerHTML = `
                <div class="carrinho-item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>

                <div class="carrinho-item-controles">
                    <button class="btn-quantidade" data-id="${item.id}" data-action="decrementar">-</button>
                    <span class="quantidade">${item.quantidade}</span>
                    <button class="btn-quantidade" data-id="${item.id}" data-action="incrementar">+</button>
                    <span class="preco-item">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                    <button class="btn-remover" data-id="${item.id}">Remover</button>
                </div>
            `;

            itensCarrinhoContainer.appendChild(div);
        });
    }

    carrinhoTotalSpan.textContent = `R$ ${calcularTotalCarrinho().toFixed(2)}`;
    atualizarContadorCarrinhoHeader();
}

// ================================
// AÇÕES DO CARRINHO
// ================================

function adicionarAoCarrinho({ id, nome, preco }) {
    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            id,
            nome,
            preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    renderizarCarrinho();

    if (typeof renderizarProdutos === "function") {
        renderizarProdutos();
    }
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    renderizarCarrinho();
}

function alterarQuantidade(id, action) {
    const item = carrinho.find(item => item.id === id);
    if (!item) return;

    if (action === 'incrementar') item.quantidade++;
    if (action === 'decrementar') {
        item.quantidade--;
        if (item.quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }
    }

    salvarCarrinho();
    renderizarCarrinho();
}

// ================================
// CHECKOUT
// ================================
function abrirCheckout() {
    if (carrinho.length === 0) return;

    checkoutItensContainer.innerHTML = "";

    carrinho.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        checkoutItensContainer.appendChild(p);
    });

    checkoutTotalSpan.textContent = `R$ ${calcularTotalCarrinho().toFixed(2)}`;
    checkoutModal.style.display = "flex";
}

const campoEndereco = document.getElementById("campoEndereco");
const inputEndereco = document.getElementById("inputEndereco");
const inputObservacoes = document.getElementById("inputObservacoes");

// Toggle Entrega / Retirada
document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "Entrega" && radio.checked) {
            campoEndereco.style.display = "block";
        }

        if (radio.value === "Retirada" && radio.checked) {
            campoEndereco.style.display = "none";
            inputEndereco.value = "";
        }
    });
});


// ================================
// WHATSAPP
// ================================
function gerarMensagemWhatsApp() {
    let mensagem = "🍔 *Pedido - Hamburgueria do Ottis*%0A%0A";

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });

    mensagem += `%0A*Total: R$ ${calcularTotalCarrinho().toFixed(2)}*%0A`;

    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked')?.value || "Não informado";

    mensagem += `%0A*Forma de pagamento:* ${formaPagamento}%0A`;
    mensagem += `%0A📍 Endereço: (informar)%0A`;
    mensagem += `%0AObrigado! 😄`;

    return mensagem;
}

function enviarPedidoParaWhatsApp() {
    const numeroWhatsApp = "5585987712548"; // <-- TROQUE PELO NÚMERO REAL

    const mensagem = gerarMensagemWhatsApp();
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    window.open(url, "_blank");
}

// ================================
// INIT
// ================================

document.addEventListener('DOMContentLoaded', () => {
    abrirCarrinhoBtnDesktop = document.getElementById('abrirCarrinhoBtnDesktop');
    abrirCarrinhoBtnMobile = document.getElementById('abrirCarrinhoBtnMobile');
    contadorCarrinhoDesktop = document.getElementById('contador-carrinho-desktop');
    contadorCarrinhoMobile = document.getElementById('contador-carrinho-mobile');
    carrinhoModal = document.getElementById('carrinhoModal');
    fecharCarrinhoBtn = document.getElementById('fecharCarrinhoBtn');
    itensCarrinhoContainer = document.getElementById('itensCarrinho');
    carrinhoTotalSpan = document.getElementById('carrinhoTotal');
    mensagemCarrinhoVazio = document.querySelector('.carrinho-vazio');
    btnFinalizarPedido = document.querySelector('.btn-finalizar-pedido');

    checkoutModal = document.getElementById('checkoutModal');
    checkoutItensContainer = document.getElementById('checkoutItens');
    checkoutTotalSpan = document.getElementById('checkoutTotal');
    btnConfirmarPedido = document.querySelector('.btn-confirmar-pedido');
    btnCancelarPedido = document.querySelector('.btn-cancelar-pedido');


    // Abrir carrinho
    [abrirCarrinhoBtnDesktop, abrirCarrinhoBtnMobile].forEach(btn => {
        btn && btn.addEventListener('click', e => {
            e.preventDefault();
            carrinhoModal.style.display = 'flex';
            renderizarCarrinho();
        });
    });

    // Fechar carrinho
    fecharCarrinhoBtn && fecharCarrinhoBtn.addEventListener('click', () => {
        carrinhoModal.style.display = 'none';
    });

    carrinhoModal && carrinhoModal.addEventListener('click', e => {
        if (e.target === carrinhoModal) carrinhoModal.style.display = 'none';
    });




    // Delegação carrinho
    itensCarrinhoContainer && itensCarrinhoContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('btn-remover')) {
            removerDoCarrinho(id);
        }

        if (e.target.classList.contains('btn-quantidade')) {
            alterarQuantidade(id, e.target.dataset.action);
        }
    });

    // Finalizar pedido
    btnFinalizarPedido && btnFinalizarPedido.addEventListener('click', abrirCheckout);

    btnCancelarPedido && btnCancelarPedido.addEventListener('click', () => {
        checkoutModal.style.display = "none";
    });

    btnConfirmarPedido && btnConfirmarPedido.addEventListener("click", () => {
    const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
    const endereco = document.getElementById("inputEndereco").value;
    const observacoes = document.getElementById("inputObservacoes").value;

    let mensagem = `*Pedido - Hamburgueria do Ottis*%0A%0A`;

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });

    mensagem += `%0A*Total:* R$ ${calcularTotalCarrinho().toFixed(2)}%0A`;
    mensagem += `*Tipo:* ${tipoEntrega}%0A`;

    if (tipoEntrega === "Entrega") {
        mensagem += `*Endereço:* ${endereco || "Não informado"}%0A`;
    }

    if (observacoes) {
        mensagem += `*Obs:* ${observacoes}%0A`;
    }

    mensagem += `*Pagamento:* ${formaPagamento}%0A`;

    const telefone = "5585987712548"; // seu número aqui
    const url = `https://wa.me/${telefone}?text=${mensagem}`;

    window.open(url, "_blank");

    // limpa tudo
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    if (typeof renderizarProdutos === "function") renderizarProdutos();

    checkoutModal.style.display = "none";
    carrinhoModal.style.display = "none";
});



    renderizarCarrinho();

});
