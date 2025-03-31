document.addEventListener("DOMContentLoaded", () => {
  const regionTabs = document.querySelectorAll(".tab-btn");
  const plansContainer = document.getElementById("plans-container");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  const samplePlans = {
    tw: [
      {
        name: "1U 1G - 500M-Hinet線路1",
        id: "tw-1u1g",
        sold: 36,
        price: { monthly: 170, quarterly: 490, yearly: 1900 }
      },
      {
        name: "1U 2G - 500M-Hinet線路1",
        id: "tw-1u2g",
        sold: 20,
        price: { monthly: 160, quarterly: 460, yearly: 1780 }
      }
    ],
    hk: [
      {
        name: "香港節點 - 開發中",
        id: "hk-dev",
        status: "developing"
      }
    ],
    us: [
      {
        name: "香港節點 - 開發中",
        id: "hk-dev",
        status: "developing"
      }
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
  
      // 開發中處理
      if (plan.status === "developing") {
        card.innerHTML = `
          <h3>${plan.name}</h3>
          <p style="color:gray;">此地區尚未開放，請稍後再試。</p>
        `;
      } else {
        card.innerHTML = `
          <h3>${plan.name}</h3>
          <p>月付：NT$${plan.price.monthly}</p>
          <p>季付：NT$${plan.price.quarterly}</p>
          <p>年付：NT$${plan.price.yearly}</p>
          <p>已售出：${plan.sold} 位使用者</p>
          <select id="pay-type-${plan.id}">
            <option value="monthly">月付</option>
            <option value="quarterly">季付</option>
            <option value="yearly">年付</option>
          </select>
          <button class="btn-primary" onclick="addToCart('${plan.id}')">加入購物車</button>
        `;
      }
  
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
        <span>CNY${item.price}</span>
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
