// Array para armazenar os produtos do carrinho
let cart = [];

// Atualizar badge e lista
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");

    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${item.name} (x${item.quantity})
      <div>
        <button onclick="changeQuantity(${index}, 1)">+</button>
        <button onclick="changeQuantity(${index}, -1)">-</button>
        <button onclick="removeItem(${index})">x</button>
      </div>
    `;
        cartItems.appendChild(li);
    });
}

// Adicionar produto ao carrinho
function addToCart(productName) {
    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: productName, quantity: 1 });
    }
    updateCart();
}

// Alterar quantidade
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

// Remover produto
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Mostrar/ocultar detalhes
document.getElementById("cart-icon").addEventListener("click", () => {
    const details = document.getElementById("cart-details");
    details.style.display = details.style.display === "block" ? "none" : "block";
});

// Finalizar compra
document.getElementById("finalize-cart").addEventListener("click", () => {
    alert("Compra finalizada com sucesso!");
    cart = [];
    updateCart();
});
