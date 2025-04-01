document.addEventListener("DOMContentLoaded", () => {
  // 登入彈窗顯示
  const loginBtn = document.getElementById("login-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setAuthMode("login");  // 顯示登入模式
    });
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 點擊 modal 外部區域關閉
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 模式切換（登入/註冊）
  const switchLink = document.getElementById("switch-to-register");
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.get
