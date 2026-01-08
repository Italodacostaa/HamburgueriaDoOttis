// ================================
// PRODUTOS.JS - HAMBURGUERIA DO OTTIS
// ================================
let termoBusca = "";
let categoriaAtiva = "Todos";

const produtos = [
  // ================= HAMBÚRGUERES =================
  {
    id: "burger-classico",
    categoria: "Hambúrgueres",
    nome: "Clássico do Ottis",
    descricao: "Blend de carnes selecionadas, cheddar, alface, tomate, picles e molho da casa.",
    preco: 29.90,
    imagem: "./assets/imagens/classico.jpg"
  },
  {
    id: "burger-bacon",
    categoria: "Hambúrgueres",
    nome: "Ottis Duplo Bacon",
    descricao: "Hambúrguer, provolone, cebola caramelizada e bacon crocante.",
    preco: 34.90,
    imagem: "./assets/imagens/bacon-duplo2.jpg"
  },
  {
    id: "burger-vegano",
    categoria: "Hambúrgueres",
    nome: "Ottis Vegano",
    descricao: "Hambúrguer de grão de bico, queijo vegano, rúcula, tomate seco e maionese de alho.",
    preco: 28.50,
    imagem: "./assets/imagens/vegano2.jpg"
  },

  // ================= ACOMPANHAMENTOS =================
  {
    id: "batata-frita",
    categoria: "Acompanhamentos",
    nome: "Batatas Fritas",
    descricao: "Crocantes por fora e macias por dentro.",
    preco: 12.00,
    imagem: "./assets/imagens/batata.jpg"
  },
  {
    id: "batata-cheddar-bacon",
    categoria: "Acompanhamentos",
    nome: "Batata Cheddar e Bacon",
    descricao: "Batata frita com cheddar cremoso e bacon crocante.",
    preco: 18.00,
    imagem: "./assets/imagens/batata-cheddar-bacon.jpg"
  },
  {
    id: "onion-rings",
    categoria: "Acompanhamentos",
    nome: "Onion rings",
    descricao: "Cebolas cortadas em forma de anéis, empanadas com uma leve camada de farinha de rosca já temperada e fritas em óleo bem quente.",
    preco: 15.00,
    imagem: "./assets/imagens/onion-rings.jpg"
  },

  // ================= BEBIDAS =================
  {
    id: "coca-cola",
    categoria: "Bebidas",
    nome: "Coca-Cola Lata",
    descricao: "Lata 350ml.",
    preco: 7.00,
    imagem: "./assets/imagens/coca-cola.webp"
  },
  {
    id: "guarana",
    categoria: "Bebidas",
    nome: "Guaraná Lata",
    descricao: "Lata 350ml.",
    preco: 7.00,
    imagem: "./assets/imagens/guarana.webp"
  },
  {
    id: "agua",
    categoria: "Bebidas",
    nome: "Água Mineral",
    descricao: "Garrafa 500ml.",
    preco: 5.00,
    imagem: "./assets/imagens/agua.jpg"
  },

  // ================= SOBREMESAS =================
  {
    id: "milkshake-nutella",
    categoria: "Sobremesas",
    nome: "Milkshake de Nutella",
    descricao: "Milkshake cremoso com Nutella e chantilly.",
    preco: 22.00,
    imagem: "./assets/imagens/ms-nutella.jpg"
  },
  {
    id: "donuts",
    categoria: "Sobremesas",
    nome: "Donuts",
    descricao: "Nossos donuts são uma obra-prima da confeitaria, feita com uma massa macia e fofa, coberta com um generoso chocolate e um recheio maravilhoso de Brigadeiro que derrete na boca.",
    preco: 8.00,
    imagem: "./assets/imagens/donuts.avif"
  },
  {
    id: "pudim",
    categoria: "Sobremesas",
    nome: "Pudim",
    descricao: "Nosso pudim é incrivelmente cremoso, com uma textura incrível que se desmancha na boca, e é coberto por uma generosa calda de caramelo, trazendo a combinação perfeita de doçura e suavidade.",
    preco: 10.00,
    imagem: "./assets/imagens/pudim.jpg"
  }
];

// Ordem visual controlada (importante para UX)
const ordemCategorias = ["Hambúrgueres", "Acompanhamentos", "Bebidas", "Sobremesas"];

// ================================
// UTIL
// ================================
function getQuantidadeNoCarrinho(id) {
  const carrinho = JSON.parse(localStorage.getItem("carrinhoOttis")) || [];
  const item = carrinho.find(p => p.id === id);
  return item ? item.quantidade : 0;
}

// ================================
// RENDER
// ================================
function renderizarProdutos() {
  const container = document.getElementById("lista-produtos");
  if (!container) return;

  container.innerHTML = "";

  let produtosFiltrados = produtos.filter(produto => {
    const matchCategoria =
      categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva;

    const matchBusca =
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.descricao.toLowerCase().includes(termoBusca);

    return matchCategoria && matchBusca;
  });

  const categorias = {};

  produtosFiltrados.forEach(produto => {
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = [];
    }
    categorias[produto.categoria].push(produto);
  });

  ordemCategorias.forEach(categoria => {
    if (!categorias[categoria]) return;

    const section = document.createElement("section");
    section.classList.add("cardapio-categoria");

    section.innerHTML = `
      <h2>${categoria}</h2>
      <div class="cardapio-grid">
        ${categorias[categoria].map(produto => {
          const qtd = getQuantidadeNoCarrinho(produto.id);

          return `
            <div class="cardapio-item">
              <img src="${produto.imagem}" alt="${produto.nome}">
              <h3>${produto.nome}</h3>
              <p>${produto.descricao}</p>
              <span class="preco">R$ ${produto.preco.toFixed(2)}</span>

              ${
                qtd === 0
                  ? `<button class="btn btn-adicionar-carrinho"
                      data-id="${produto.id}"
                      data-nome="${produto.nome}"
                      data-preco="${produto.preco}">
                      Adicionar
                    </button>`
                  : `<div class="controle-quantidade">
                      <button class="btn-menos" data-id="${produto.id}">−</button>
                      <span class="quantidade">${qtd}</span>
                      <button class="btn-mais" data-id="${produto.id}">+</button>
                    </div>`
              }
            </div>
          `;
        }).join("")}
      </div>
    `;

    container.appendChild(section);
  });

  bindEventosQuantidade();
}

// ================================
// EVENTOS DOS PRODUTOS
// ================================
function bindEventosQuantidade() {
  document.querySelectorAll(".btn-adicionar-carrinho").forEach(btn => {
    btn.addEventListener("click", e => {
      const { id, nome, preco } = e.currentTarget.dataset;
      if (typeof adicionarAoCarrinho === "function") {
        adicionarAoCarrinho({ id, nome, preco: Number(preco) });
      }
      renderizarProdutos();
    });
  });

  document.querySelectorAll(".btn-mais").forEach(btn => {
    btn.addEventListener("click", e => {
      if (typeof alterarQuantidade === "function") {
        alterarQuantidade(e.currentTarget.dataset.id, "incrementar");
      }
      renderizarProdutos();
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", e => {
      if (typeof alterarQuantidade === "function") {
        alterarQuantidade(e.currentTarget.dataset.id, "decrementar");
      }
      renderizarProdutos();
    });
  });
}

// ================================
// FILTRO
// ================================
const filtros = document.querySelectorAll(".filtro-btn");
if (filtros.length > 0) {
  filtros.forEach(btn => {
    btn.addEventListener("click", () => {
      categoriaAtiva = btn.dataset.categoria;

      filtros.forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      renderizarProdutos();
    });
  });
}

// ================================
// BUSCA
// ================================
const inputBusca = document.getElementById("inputBusca");
if (inputBusca) {
  inputBusca.addEventListener("input", e => {
    termoBusca = e.target.value.toLowerCase();
    renderizarProdutos();
  });
}

// ================================
// INIT
// ================================

document.addEventListener("DOMContentLoaded", renderizarProdutos);