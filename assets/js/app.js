document.addEventListener("DOMContentLoaded", () => {
  let mode = "login"; // 全域模式狀態

  initNavBar();
  initFooter();
  bindCommonEvents();
});

function initNavBar() {
  const role = localStorage.getItem("role");
  const controlPanelLink = document.getElementById("control-panel");

  if (role === "admin") {
    controlPanelLink.href = "admin_dashboard.html";
  } else if (role === "user") {
    controlPanelLink.href = "dashboard.html";
  }
}

function initFooter() {
  // 可加入 footer 初始化邏輯
}

function bindCommonEvents() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");
  const switchLink = document.getElementById("switch-to-register");
  const authForm = document.getElementById("auth-form");
  const sendCodeBtn = document.getElementById("send-code");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setAuthMode("login");
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

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      setAuthMode("login"); // 關閉時預設回登入
    });
  }

  if (switchLink) {
    switchLink.addEventListener("click", (e) => {
      e.preventDefault();
      setAuthMode(mode === "login" ? "register" : "login");
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit);
  }

  if (sendCodeBtn) {
    sendCodeBtn.addEventListener("click", sendVerificationCode);
  }
}

// 模式切換邏輯
function setAuthMode(type) {
  mode = type;
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.getElementById("submit-auth");

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

// 處理登入或註冊提交
function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (mode === "register") {
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const code = document.getElementById("verification-code").value.trim();

    if (password !== confirmPassword) {
      return alert("密碼不一致");
    }

    // ✅ 1. 驗證驗證碼
    fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return alert(data.error || "驗證碼錯誤");

        // ✅ 2. 發送註冊請求
        fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })
          .then((res) => res.json())
          .then(handleAuthSuccess)
          .catch(() => alert("註冊錯誤"));
      });
  } else {
    // ✅ 登入請求
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then(handleAuthSuccess)
      .catch(() => alert("登入錯誤"));
  }
}

// 成功登入/註冊後統一處理
function handleAuthSuccess(data) {
  if (!data.token) return alert(data.error || "操作失敗");

  localStorage.setItem("jwt_token", data.token);
  localStorage.setItem("role", data.role);
  document.getElementById("auth-modal").classList.add("hidden");

  if (data.role === "admin") {
    window.location.href = "admin_dashboard.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

// 發送驗證碼按鈕
function sendVerificationCode() {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("請輸入 Email");

  fetch("/api/send-verification-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then((res) => res.json())
    .then((data) => alert(data.message || data.error || "發送失敗"))
    .catch(() => alert("寄信錯誤"));
}
