async function carregarProdutos() {
  const token = localStorage.getItem("jwtToken");
  const grid = document.getElementById("produtos-grid");

  if (!token) {
    grid.innerHTML = "<p style='color:red;'>Você precisa estar logado para ver os produtos.</p>";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/produtos/referencias/listar?page=0&size=50", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      grid.innerHTML = `<p style='color:red;'>Erro: ${data.message || "Não foi possível carregar os produtos."}</p>`;
      return;
    }

    // Limpa a grid
    grid.innerHTML = "";

    data.content.forEach(produto => {
      const card = document.createElement("div");
      card.classList.add("produto-card");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.margin = "5px";
      card.style.width = "200px";
      card.style.display = "inline-block";
      card.style.verticalAlign = "top";
      card.style.textAlign = "center";

      // Imagem
      const img = document.createElement("img");
      img.src = produto.urlImg || "https://via.placeholder.com/150?text=Sem+Imagem";
      img.alt = produto.nome;
      img.style.width = "100%";
      img.style.height = "150px";
      img.style.objectFit = "cover";
      card.appendChild(img);

      // Nome
      const nome = document.createElement("h4");
      nome.textContent = produto.nome;
      card.appendChild(nome);

      // Marca
      if (produto.marca) {
        const marca = document.createElement("p");
        marca.textContent = `Marca: ${produto.marca}`;
        card.appendChild(marca);
      }

      // Descrição
      if (produto.descricao) {
        const desc = document.createElement("p");
        desc.textContent = produto.descricao;
        desc.style.fontSize = "0.9em";
        card.appendChild(desc);
      }

      // Unidade e valor
      if (produto.unidadeMedida && produto.valorMedida != null) {
        const valor = document.createElement("p");
        valor.textContent = `${produto.valorMedida} / ${produto.unidadeMedida}`;
        card.appendChild(valor);
      }

      // Código de barras
      if (produto.codigoBarra) {
        const codigo = document.createElement("p");
        codigo.textContent = `Código: ${produto.codigoBarra}`;
        codigo.style.fontSize = "0.8em";
        card.appendChild(codigo);
      }

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    grid.innerHTML = "<p style='color:red;'>Erro ao se conectar ao servidor.</p>";
  }
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", carregarProdutos);
