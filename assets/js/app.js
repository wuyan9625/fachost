document.addEventListener("DOMContentLoaded", () => {
  initNavBar();
  initFooter();
  bindCommonEvents();
});

// 初始化導航欄
function initNavBar() {
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      handleNavigation(link.href);
    });
  });
}

// 跳轉處理
function handleNavigation(url) {
  window.location.href = url;
}

// 初始化頁腳（你可加其他資訊）
function initFooter() {}

// 綁定登入/登出/登入表單
function bindCommonEvents() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("auth-modal");
  const closeModal = document.getElementById("close-modal");
  const authForm = document.getElementById("auth-form");

  if (loginBtn && modal) {
    loginBtn.addEventListener("click", () => {
      modal.classList.remove("hidden"); // 顯示登入彈窗
    });
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("role");
      alert("已登出！");
      window.location.href = "/";
    });
  }

  // 登入提交事件
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      fetch("http://122.117.80.251:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          alert("✅ 登入成功！");
          localStorage.setItem("jwt_token", data.token);
          localStorage.setItem("role", data.role);
          document.getElementById("auth-modal").classList.add("hidden");
          window.location.href = "dashboard.html"; // 或導向你想去的頁面
        } else {
          alert(data.error || "登入失敗");
        }
      })
      .catch(err => {
        alert("伺服器錯誤，請稍後再試");
        console.error(err);
