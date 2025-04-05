document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");

  // Get cart items from LocalStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>購物車是空的</p>";
  } else {
    cartItems.forEach(item => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <h4>${item.name}</h4>
        <p>價格：${item.price}元</p>
        <p>數量：${item.quantity}</p>
        <button class="remove-item" data-item-id="${item.id}">移除</button>
      `;
      cartContainer.appendChild(cartItem);
    });
  }

  document.getElementById("checkout-btn").addEventListener("click", function () {
    // Handle checkout process here
  });

  // Handle remove item
  cartContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-item")) {
      const itemId = e.target.getAttribute("data-item-id");
      removeItemFromCart(itemId);
    }
  });

  function removeItemFromCart(itemId) {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    location.reload();
  }
});
