// ✅ app.js
// 處理 UI 展示、彈窗顯示、登入/註冊模式切換

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

  // 將 mode 暴露給其他檔案使用
  window.getAuthMode = () => mode;
});// ✅ auth.js
// 專注處理登入 / 註冊提交 + 驗證碼發送

document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  const sendCodeBtn = document.getElementById("send-code");

  authForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const mode = window.getAuthMode?.() || "login";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (mode === "register") {
      const confirmPassword = document.getElementById("confirm-password").value.trim();
      const code = document.getElementById("verification-code").value.trim();

      if (password !== confirmPassword) return alert("兩次密碼不一致！");

      // 驗證碼驗證
      fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) return alert(data.error || "驗證失敗");

          // 註冊流程
          return fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
        })
        .then(res => res?.json?.())
        .then(data => {
          if (data?.message === "註冊成功") {
            alert("✅ 註冊成功");
            document.getElementById("auth-modal").classList.add("hidden");
          } else {
            alert(data?.error || "註冊失敗");
          }
        })
        .catch(err => alert("錯誤: " + err));
    } else {
      // 登入流程
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("jwt_token", data.token);
            localStorage.setItem("role", data.role);
            document.getElementById("auth-modal").classList.add("hidden");
            window.location.href = data.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
          } else {
            alert(data.error || "登入失敗");
          }
        })
        .catch(err => alert("登入錯誤: " + err));
    }
  });

  sendCodeBtn?.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    if (!email) return alert("請先輸入 Email！");

    fetch("/api/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => alert(data.message || data.error || "未知錯誤"))
      .catch(err => alert("發送錯誤: " + err));
  });
});
