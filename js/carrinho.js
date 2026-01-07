// ================================
// CARRINHO.JS - HAMBURGUERIA DO OTTIS
// ================================

// --- Estado ---
let carrinho = JSON.parse(localStorage.getItem('carrinhoOttis')) || [];

// --- DOM ---
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

// --- Confirmação modal ---
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
                    <span>${item.quantidade}</span>
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
// AÇÕES
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

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    alert(`Pedido finalizado!\nTotal: R$ ${calcularTotalCarrinho().toFixed(2)}`);

    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    carrinhoModal && (carrinhoModal.style.display = 'none');
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
            carrinhoModal && (carrinhoModal.style.display = 'flex');
            renderizarCarrinho();
        });
    });

    // Fechar carrinho
    fecharCarrinhoBtn && fecharCarrinhoBtn.addEventListener('click', () => {
        carrinhoModal && (carrinhoModal.style.display = 'none');
    });

    carrinhoModal && carrinhoModal.addEventListener('click', e => {
        if (e.target === carrinhoModal) carrinhoModal.style.display = 'none';
    });

    // 🔥 DELEGAÇÃO – BOTÃO ADICIONAR (FUNCIONA COM JS DINÂMICO)
    

    function atualizarContadorCarrinhoHeader() {
    const total = calcularTotalItens();

    const atualizar = (el) => {
        if (!el) return;
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';

        el.classList.remove('animar');
        if (total > 0) {
            void el.offsetWidth; // força reflow
            el.classList.add('animar');
        }
    };

        atualizar(contadorCarrinhoDesktop);
        atualizar(contadorCarrinhoMobile);
    }

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

        btnFinalizarPedido && btnFinalizarPedido.addEventListener('click', abrirCheckout);
        btnCancelarPedido && btnCancelarPedido.addEventListener('click', () => {
        checkoutModal.style.display = "none";
    });

    btnConfirmarPedido && btnConfirmarPedido.addEventListener('click', () => {
        alert("Pedido confirmado! Obrigado pela preferência 😄");

        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();

        if (typeof renderizarProdutos === "function") {
            renderizarProdutos();
        }

        checkoutModal.style.display = "none";
        carrinhoModal.style.display = "none";
    });


    renderizarCarrinho();
    
});
