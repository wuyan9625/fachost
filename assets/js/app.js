document.addEventListener("DOMContentLoaded", () => {
  const controlPanelBtn = document.getElementById("control-panel");
  const loginBtn = document.getElementById("login-btn");
  const langToggle = document.getElementById("lang-toggle");

  const token = localStorage.getItem("token");

  if (token) {
    // 已登入狀態：顯示控制台、隱藏登入
    loginBtn.classList.add("hidden");
    controlPanelBtn.classList.remove("hidden");

    controlPanelBtn.onclick = () => {
      window.location.href = "/dashboard.html"; // 控制台頁面
    };
  } else {
    // 未登入狀態
    loginBtn.classList.remove("hidden");
    controlPanelBtn.classList.add("hidden");
  }

  // 🌐 多語言切換（目前只有 EN / ZH 切換示意）
  langToggle.onclick = () => {
    const current = langToggle.textContent.trim();
    langToggle.textContent = current === "EN" ? "中文" : "EN";
    alert("多語系切換功能尚未實作");
  };
});
