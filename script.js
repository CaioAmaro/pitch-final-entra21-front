// 1. Lista de produtos fora da Promise
const listaDeProdutos = [
  { id: 1, produto: "carne", quantidadeProdutos: 76 },
  { id: 2, produto: "arroz", quantidadeProdutos: 112 },
  { id: 3, produto: "feijão", quantidadeProdutos: 89 },
  { id: 4, produto: "macarrão", quantidadeProdutos: 54 },
  { id: 5, produto: "leite", quantidadeProdutos: 120 }
];

// 2. Função que retorna a Promise simulando um fetch
function fetchFakeProdutos() {
  return new Promise((resolve) => { setTimeout(() => { resolve(listaDeProdutos); }, 1000);});
}

// 3. Consumindo a Promise
fetchFakeProdutos().then((produtos) => {
  console.log("Produtos recebidos:", produtos);
});

// Função para criar um card Bootstrap para um produto
function criarCardProduto(produto) {
  const divCol = document.createElement("div");
  divCol.className = "col-sm-6 col-md-4 col-lg-3";

  const card = document.createElement("div");
  card.className = "card shadow-sm";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const titulo = document.createElement("h5");
  titulo.className = "card-title";
  titulo.textContent = produto.produto;

  const quantidade = document.createElement("p");
  quantidade.className = "card-text";
  quantidade.textContent = `Quantidade: ${produto.quantidadeProdutos}`;

  cardBody.appendChild(titulo);
  cardBody.appendChild(quantidade);
  card.appendChild(cardBody);
  divCol.appendChild(card);

  return divCol;
}


//Consumindo o mock e adicionando os cards na página
fetchFakeProdutos().then((produtos) => {
  const container = document.getElementById("cards-container");
  produtos.forEach((produto) => {
    const card = criarCardProduto(produto);
    container.appendChild(card);
  });
});