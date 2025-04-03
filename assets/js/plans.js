document.addEventListener("DOMContentLoaded", () => {
  const regionTabs = document.querySelectorAll(".tab-btn");
  const plansContainer = document.getElementById("plans-container");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  let plansData = {};

  // 初始化：根據用戶角色顯示不同控制台
  const role = localStorage.getItem("role");
  const controlPanelBtn = document.getElementById("control-panel");
  if (controlPanelBtn) {
    if (role === "admin") {
      controlPanelBtn.innerHTML = "管理控制台";
      controlPanelBtn.onclick = () => {
        window.location.href = "admin-dashboard.html"; // 管理員控制台頁面
      };
    } else {
      controlPanelBtn.innerHTML = "使用者控制台";
      controlPanelBtn.onclick = () => {
        window.location.href = "user-dashboard.html"; // 使用者控制台頁面
      };
    }
  }

  // 取得套餐資料
  async function fetchPlans() {
    try {
      const response = await fetch("/api/plans", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
        }
      });
      const data = await response.json();
      plansData = groupPlansByRegion(data);
      const defaultTab = document.querySelector(".tab-btn.active");
      if (defaultTab) {
        renderPlans(defaultTab.dataset.region);
      }
    } catch (error) {
      console.error("無法加載套餐資料:", error);
      alert("加載套餐資料失敗，請稍後再試！");
    }
  }

  // 根據套餐資料將方案按區域分組
  function groupPlansByRegion(plans) {
    return plans.reduce((acc, plan) => {
      const region = plan.region.toLowerCase();
      if (!acc[region]) acc[region] = [];
      acc[region].push(plan);
      return acc;
    }, {});
  }

  // 渲染方案列表
  function renderPlans(region) {
    plansContainer.innerHTML = "";
    const plans = plansData[region] || [];
    plans.forEach((plan) => {
      const card = document.createElement("div");
      card.className = "plan-card";

      const isOutOfStock = plan.sold >= plan.inventory;
      card.innerHTML = `
        <h3>${plan.region} - ${plan.name}</h3>
        <p>月付：USD$${plan.price.monthly}</p>
        <p>季付：USD$${plan.price.quarterly}</p>
        <p>年付：USD$${plan.price.yearly}</p>
        <p>已售出：${plan.sold} 位</p>
        <p>剩餘庫存：${plan.inventory - plan.sold}</p>
        <button class="btn-primary" onclick="addToCart('${plan.id}')" ${isOutOfStock ? 'disabled' : ''}>
          ${isOutOfStock ? '庫存不足' : '加入購物車'}
        </button>
      `;
      plansContainer.appendChild(card);
    });
  }

  // 監聽區域選項
  regionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".tab-btn.active").classList.remove("active");
      tab.classList.add("active");
      const region = tab.dataset.region;
      renderPlans(region);
    });
  });

  // 加入購物車
  window.addToCart = function (planId) {
    const plan = plansData[planId.split("-")[0]].find((p) => p.id === planId);
    if (!plan) {
      alert("套餐資料有誤！");
      return;
    }

    if (plan.inventory <= plan.sold) {
      alert("該套餐庫存不足，無法加入購物車！");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(plan);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("已加入購物車！");
    renderCart();
  };

  // 顯示購物車
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

  // 移除購物車項目
  window.removeItem = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  // 結帳功能
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalAmount = cart.reduce((total, item) => total + item.price, 0);

      try {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalAmount })
        });
        const data = await res.json();

        if (res.ok) {
          const paymentLink = data.paymentLink;
          window.location.href = paymentLink;
        } else {
          window.location.href = "/order-failed.html"; // 失敗頁面
        }
      } catch (err) {
        alert("發生錯誤：" + err);
        window.location.href = "/order-failed.html"; // 失敗頁面
      }
    });
  }

  // 初始加載套餐資料
  fetchPlans();
});
