// carrinho.js

// --- Referências aos elementos do DOM (serão obtidas dentro do DOMContentLoaded) ---
let abrirCarrinhoBtnDesktop;
let abrirCarrinhoBtnMobile;
let contadorCarrinhoDesktop;
let contadorCarrinhoMobile;
let carrinhoModal;
let fecharCarrinhoBtn;
let itensCarrinhoContainer; // Container onde os itens serão listados no modal
let carrinhoTotalSpan; // Span para exibir o total do carrinho
let mensagemCarrinhoVazio; // Mensagem de carrinho vazio
let btnFinalizarPedido; // Botão de finalizar pedido

// --- Variáveis do Carrinho ---
// Tenta carregar o carrinho do Local Storage, ou inicia um array vazio
let carrinho = JSON.parse(localStorage.getItem('carrinhoOttis')) || [];

// --- Funções de Ajuda ---

// Salva o carrinho no Local Storage
function salvarCarrinho() {
    localStorage.setItem('carrinhoOttis', JSON.stringify(carrinho));
}

// Calcula o total monetário do carrinho
function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Atualiza AMBOS os contadores de itens no cabeçalho (desktop e mobile)
function atualizarContadorCarrinhoHeader() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    // Atualiza o contador do desktop, se o elemento existir
    if (contadorCarrinhoDesktop) {
        contadorCarrinhoDesktop.textContent = totalItens;
        contadorCarrinhoDesktop.style.display = totalItens > 0 ? 'block' : 'none';
        // Adiciona/remove a classe de animação (se você adicionou no CSS)
        contadorCarrinhoDesktop.classList.remove('animar');
        if (totalItens > 0) {
            void contadorCarrinhoDesktop.offsetWidth; // Força reflow para reiniciar animação
            contadorCarrinhoDesktop.classList.add('animar');
        }
    }
    // Atualiza o contador do mobile, se o elemento existir
    if (contadorCarrinhoMobile) {
        contadorCarrinhoMobile.textContent = totalItens;
        contadorCarrinhoMobile.style.display = totalItens > 0 ? 'block' : 'none';
        // Adiciona/remove a classe de animação (se você adicionou no CSS)
        contadorCarrinhoMobile.classList.remove('animar');
        if (totalItens > 0) {
            void contadorCarrinhoMobile.offsetWidth;
            contadorCarrinhoMobile.classList.add('animar');
        }
    }
}

// Renderiza (exibe) os itens do carrinho no modal
function renderizarCarrinho() {
    // Limpa o conteúdo atual do container
    itensCarrinhoContainer.innerHTML = ''; 
    
    // Mostra ou esconde a mensagem de carrinho vazio
    if (carrinho.length === 0) {
        mensagemCarrinhoVazio.style.display = 'block';
        if (btnFinalizarPedido) {
            btnFinalizarPedido.disabled = true; // Desabilita o botão finalizar se o carrinho estiver vazio
        }
    } else {
        mensagemCarrinhoVazio.style.display = 'none';
        if (btnFinalizarPedido) {
            btnFinalizarPedido.disabled = false; // Habilita o botão finalizar
        }

        // Adiciona cada item do carrinho ao DOM
        carrinho.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrinho-item');
            itemDiv.innerHTML = `
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
            itensCarrinhoContainer.appendChild(itemDiv);
        });
    }

    // Atualiza o total monetário no modal
    carrinhoTotalSpan.textContent = `R$ ${calcularTotalCarrinho().toFixed(2)}`;
    atualizarContadorCarrinhoHeader(); // Garante que o contador do header também seja atualizado
}

// --- Funções de Ação do Carrinho ---

// Adiciona um item ao carrinho
function adicionarAoCarrinho(itemData) {
    const itemExistente = carrinho.find(item => item.id === itemData.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        // Adiciona o item com quantidade 1 se não existir
        carrinho.push({ ...itemData, quantidade: 1 });
    }
    salvarCarrinho();
    renderizarCarrinho(); // Atualiza o modal e o contador
    
    // Opcional: Abre o modal automaticamente ao adicionar o primeiro item
    if (carrinhoModal && carrinho.length === 1 && itemExistente === undefined) {
        carrinhoModal.style.display = 'flex';
    }
}

// Remove um item do carrinho
function removerDoCarrinho(itemId) {
    carrinho = carrinho.filter(item => item.id !== itemId);
    salvarCarrinho();
    renderizarCarrinho();
}

// Incrementa/decrementa a quantidade de um item
function alterarQuantidade(itemId, action) {
    const item = carrinho.find(item => item.id === itemId);
    if (item) {
        if (action === 'incrementar') {
            item.quantidade++;
        } else if (action === 'decrementar') {
            item.quantidade--;
            if (item.quantidade <= 0) {
                removerDoCarrinho(itemId); // Remove o item se a quantidade chegar a zero ou menos
                return; // Sai da função para evitar processamento adicional
            }
        }
        salvarCarrinho();
        renderizarCarrinho();
    }
}

// Função para finalizar o pedido (simulação)
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido!');
        return;
    }

    // Aqui você integraria com um backend, API de pagamento, etc.
    // Por enquanto, é apenas uma simulação.
    console.log('Pedido finalizado!');
    console.log('Itens do pedido:', carrinho);
    console.log('Total do pedido: R$', calcularTotalCarrinho().toFixed(2));

    alert(`Pedido finalizado com sucesso!\nTotal: R$ ${calcularTotalCarrinho().toFixed(2)}`);

    // Limpa o carrinho após a finalização
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    if (carrinhoModal) {
        carrinhoModal.style.display = 'none'; // Fecha o modal após finalizar
    }
}

// --- Inicialização e Event Listeners (TUDO DENTRO DE DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // Obter referências aos elementos DOM AQUI, quando o DOM estiver pronto
    abrirCarrinhoBtnDesktop = document.getElementById('abrirCarrinhoBtnDesktop');
    abrirCarrinhoBtnMobile = document.getElementById('abrirCarrinhoBtnMobile');
    contadorCarrinhoDesktop = document.getElementById('contador-carrinho-desktop');
    contadorCarrinhoMobile = document.getElementById('contador-carrinho-mobile');
    carrinhoModal = document.getElementById('carrinhoModal');
    fecharCarrinhoBtn = document.getElementById('fecharCarrinhoBtn');
    itensCarrinhoContainer = document.getElementById('itensCarrinho');
    carrinhoTotalSpan = document.getElementById('carrinhoTotal');
    mensagemCarrinhoVazio = document.querySelector('.carrinho-vazio');
    btnFinalizarPedido = document.querySelector('.btn-finalizar-pedido'); // Referência ao botão de finalizar

    // Evento para abrir o modal do carrinho (botão DESKTOP)
    if (abrirCarrinhoBtnDesktop) {
        abrirCarrinhoBtnDesktop.addEventListener('click', (e) => {
            e.preventDefault(); // Evita o comportamento padrão do link
            if (carrinhoModal) {
                carrinhoModal.style.display = 'flex'; // Exibe o modal
                renderizarCarrinho(); // Garante que o conteúdo esteja atualizado ao abrir
            }
        });
    }

    // Evento para abrir o modal do carrinho (botão MOBILE)
    if (abrirCarrinhoBtnMobile) {
        abrirCarrinhoBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            if (carrinhoModal) {
                carrinhoModal.style.display = 'flex';
                renderizarCarrinho();
            }
        });
    }

    // Evento para fechar o modal do carrinho (botão 'X')
    if (fecharCarrinhoBtn) {
        fecharCarrinhoBtn.addEventListener('click', () => {
            if (carrinhoModal) {
                carrinhoModal.style.display = 'none';
            }
        });
    }

    // Evento para fechar o modal ao clicar fora do conteúdo
    if (carrinhoModal) {
        carrinhoModal.addEventListener('click', (e) => {
            if (e.target === carrinhoModal) {
                carrinhoModal.style.display = 'none';
            }
        });
    }

    // Event listeners para todos os botões "Adicionar ao Carrinho"
    // Isso funciona para os botões na index.html e cardapio.html
    document.querySelectorAll('.btn-adicionar-carrinho').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            const itemName = e.target.dataset.nome;
            const itemPreco = parseFloat(e.target.dataset.preco);

            adicionarAoCarrinho({ id: itemId, nome: itemName, preco: itemPreco });
        });
    });

    // Event listener para os botões de remover e alterar quantidade dentro do modal
    // Usa delegação de eventos para capturar cliques nos botões que são adicionados dinamicamente
    if (itensCarrinhoContainer) {
        itensCarrinhoContainer.addEventListener('click', (e) => {
            const target = e.target;
            const itemId = target.dataset.id;

            if (target.classList.contains('btn-remover')) {
                removerDoCarrinho(itemId);
            } else if (target.classList.contains('btn-quantidade')) {
                const action = target.dataset.action;
                alterarQuantidade(itemId, action);
            }
        });
    }

    // Event listener para o botão Finalizar Pedido
    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', finalizarPedido);
    }

    // Renderiza o carrinho e atualiza o contador quando a página carrega
    renderizarCarrinho();
});