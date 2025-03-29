document.addEventListener("DOMContentLoaded", () => {
  // 語言切換（僅作示意，可擴充）
  const langToggle = document.getElementById("lang-toggle");
  langToggle.addEventListener("click", () => {
    if (langToggle.textContent === "EN") {
      langToggle.textContent = "中文";
      alert("Switched to English (功能待擴充)");
    } else {
      langToggle.textContent = "EN";
      alert("已切換為中文（功能待擴充）");
    }
  });

  // 登入彈窗顯示
  const loginBtn = document.getElementById("login-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");

  loginBtn && loginBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    setAuthMode("login");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 點擊 modal 外部區域關閉
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 模式切換
  const switchLink = document.getElementById("switch-to-register");
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.getElementById("submit-auth");
  let mode = "login";

  switchLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (mode === "login") {
      setAuthMode("register");
    } else {
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
      switchLink.innerHTML = `已經有帳號？<a href="#" id="switch-to-register">登入</a>`;
    } else {
      authTitle.textContent = "登入";
      confirmGroup.classList.add("hidden");
      verificationGroup.classList.add("hidden");
      submitBtn.textContent = "登入";
      switchLink.innerHTML = `還沒有帳號？<a href="#" id="switch-to-register">註冊</a>`;
    }
  }

  // 發送驗證碼（未串後端，佔位用）
  const sendCodeBtn = document.getElementById("send-code");
  sendCodeBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    if (!email) {
      alert("請先輸入 Email！");
      return;
    }
    alert(`驗證碼已發送至：${email}（示意）`);
    // 實際應發 POST 請求
  });
});
