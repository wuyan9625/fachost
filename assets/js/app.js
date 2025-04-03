document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");
  const switchLink = document.getElementById("switch-to-register");
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.getElementById("submit-auth");
  const controlPanelBtn = document.getElementById("control-panel");

  let mode = "login"; // 初始為登入

  loginBtn?.addEventListener("click", () => {
    modal.classList.remove("hidden");
    setAuthMode("login");
  });

  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    alert("已登出");
    window.location.href = "/";
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    setAuthMode("login");
  });

  switchLink?.addEventListener("click", (e) => {
    e.preventDefault();
    setAuthMode(mode === "login" ? "register" : "login");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      setAuthMode("login");
    }
  });

  function setAuthMode(type) {
    mode = type;
    if (type === "register") {
      authTitle.textContent = "註冊";
      confirmGroup.classList.remove("hidden");
      verificationGroup.classList.remove("hidden");
      submitBtn.textContent = "註冊";
    } else {
      authTitle.textContent = "登入";
      confirmGroup.classList.add("hidden");
      verificationGroup.classList.add("hidden");
      submitBtn.textContent = "登入";
    }
  }

  // ✅ 提供 auth.js 使用
  window.getAuthMode = () => mode;

  // ✅ 控制台按鈕根據角色跳轉
  controlPanelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const role = localStorage.getItem("role");
    if (role === "admin") {
      window.location.href = "admin_dashboard.html";
    } else if (role === "user") {
      window.location.href = "dashboard.html";
    } else {
      alert("請先登入帳號！");
    }
  });
});
