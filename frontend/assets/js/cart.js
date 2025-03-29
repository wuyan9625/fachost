document.addEventListener("DOMContentLoaded", () => {
  const regionTabs = document.querySelectorAll(".tab-btn");
  const plansContainer = document.getElementById("plans-container");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  const samplePlans = {
    tw: [
      { name: "1U 1G - 台灣線路1", price: 160, id: "tw-1u1g" },
      { name: "2U 2G - 台灣線路2", price: 280, id: "tw-2u2g" }
    ],
    hk: [
      { name: "1U 1G - 香港節點", price: 150, id: "hk-1u1g" },
      { name: "2U 4G - 香港高速", price: 320, id: "hk-2u4g" }
    ],
    us: [
      { name: "1U 1G - 美西", price: 140, id: "us-1u1g" },
      { name: "2U 2G - 美東", price: 270, id: "us-2u2g" }
    ]
  };

  regionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".tab-btn.active").classList.remove("active");
      tab.classList.add("active");
      const region = tab.dataset.region;
      renderPlans(region);
    });
  });

  function renderPlans(region) {
    plansContainer.innerHTML = "";
    samplePlans[region].forEach((plan) => {
      const card = document.createElement("div");
      card.className = "plan-card";
      card.innerHTML = `
        <h3>${plan.name}</h3>
        <p>NT$${plan.price} / 月</p>
        <button class="btn-primary" onclick="addToCart('${plan.id}')">加入購物車</button>
      `;
      plansContainer.appendChild(card);
    });
  }

  window.addToCart = function (id) {
    const region = id.split("-")[0];
    const plan = samplePlans[region].find((p) => p.id === id);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(plan);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("已加入購物車！");
  };

  if (cartItemsContainer) {
    renderCart();
  }

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <span>${item.name}</span>
        <span>NT$${item.price}</span>
        <button onclick="removeItem(${index})">移除</button>
      `;
      cartItemsContainer.appendChild(div);
      total += item.price;
    });

    if (totalPriceSpan) totalPriceSpan.textContent = `NT$${total}`;
  }

  window.removeItem = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("結帳流程尚未接上金流（測試中）");
    });
  }

  // 初始顯示第一個 tab
  const defaultTab = document.querySelector(".tab-btn.active");
  if (defaultTab) {
    renderPlans(defaultTab.dataset.region);
  }
});
