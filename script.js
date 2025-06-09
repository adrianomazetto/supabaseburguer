// 1. Configuração do Supabase
//está no supabase.js

// 2. Elementos do DOM
const burgerList = document.getElementById("burger-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");

// 3. Carrinho local
let cart = [];

// 4. Renderizar hambúrgueres
async function loadBurgers() {
  const { data: burgers, error } = await supabase.from("burgers").select("*");

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    return;
  }

  burgers.forEach(burger => {
    const div = document.createElement("div");
    div.classList.add("burger");
    div.innerHTML = `
      <img src="${burger.image}" alt="${burger.name}">
      <h3>${burger.name}</h3>
      <p>R$ ${burger.price.toFixed(2)}</p>
      <button class="add-to-cart" 
              data-id="${burger.id}" 
              data-name="${burger.name}" 
              data-price="${burger.price}">
        Adicionar ao carrinho
      </button>
    `;
    burgerList.appendChild(div);
  });
}

// 5. Adicionar ao carrinho
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const btn = e.target;
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    cart.push({ id, name, price });
    renderCart();
  }
});

// 6. Atualizar carrinho no DOM
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// 7. Finalizar pedido
// checkoutBtn.addEventListener("click", async () => {
//   if (cart.length === 0) {
//     alert("Carrinho vazio.");
//     return;
//   }

//   const total = cart.reduce((acc, item) => acc + item.price, 0);
//   const { error } = await supabase.from("orders").insert([
//     {
//       items: cart,
//       total: total
//     }
//   ]);

//   if (error) {
//     alert("Erro ao finalizar pedido.");
//     console.error(error);
//   } else {
//     alert("Pedido enviado com sucesso!");
//     cart = [];
//     renderCart();
//   }
// });

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Carrinho vazio.");
    return;
  }

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // 1. Enviar para Supabase
  const { error } = await supabase.from("orders").insert([
    {
      items: cart,
      total: total
    }
  ]);

  if (error) {
    alert("Erro ao finalizar pedido.");
    console.error(error);
    return;
  }

  // 2. Gerar texto do pedido para WhatsApp
  let mensagem = "🍔 *Pedido Hamburgueria:*\n\n";
  cart.forEach(item => {
    mensagem += `• ${item.name} - R$ ${item.price.toFixed(2)}\n`;
  });
  mensagem += `\n🧾 *Total:* R$ ${total.toFixed(2)}`;

  // 3. Criar link do WhatsApp
  const numero = "5515981693581"; // <- Substitua com o número da hamburgueria (formato internacional sem +)
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  // 4. Redirecionar para WhatsApp
  window.open(link, "_blank");

  // 5. Limpar carrinho
  alert("Pedido enviado com sucesso!");
  cart = [];
  renderCart();
});


// 8. Inicialização
document.addEventListener("DOMContentLoaded", loadBurgers);

