document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");

  const switchLink = document.getElementById("switch-to-register");
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.getElementById("submit-auth");
  const sendCodeBtn = document.getElementById("send-code");

  // 默認顯示登錄窗口
  let mode = "login";  // 默認模式為登入

  // 顯示登入彈窗
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setAuthMode("login");  // 默認顯示登入模式
    });
  }

  // 關閉彈窗
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 點擊 modal 背景關閉
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 切換登入與註冊
  switchLink.addEventListener("click", (e) => {
    e.preventDefault();
    // 點擊後根據當前模式切換
    setAuthMode(mode === "login" ? "register" : "login");
  });

  function setAuthMode(type) {
    mode = type;  // 切換模式
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

  // 發送驗證碼按鈕
  sendCodeBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    if (!email) {
      alert("請先輸入 Email！");
      return;
    }
    fetch("/api/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert(data.error || "發送失敗");
        }
      })
      .catch((error) => alert("發送驗證碼錯誤：" + error));
  });

  // 表單提交（登入/註冊）
  document.getElementById("auth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (mode === "register") {
      const confirmPassword = document.getElementById("confirm-password").value;
      const verificationCode = document.getElementById("verification-code").value;

      if (password !== confirmPassword) {
        alert("兩次密碼不一致！");
        return;
      }

      // 1️⃣ 驗證驗證碼正確性
      fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode })
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert(data.error || "驗證碼錯誤或已過期");
            return;
          }

          // 2️⃣ 驗證通過 → 執行註冊
          fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.message === "註冊成功") {
                alert("註冊成功！");
                modal.classList.add("hidden");
              } else {
                alert(data.error || data.message || "註冊失敗");
              }
            })
            .catch((error) => alert("註冊錯誤：" + error));
        })
        .catch((error) => alert("驗證碼檢查錯誤：" + error));
    } else {
      // 登入流程
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("jwt_token", data.token);
            localStorage.setItem("role", data.role);
            if (data.role === "admin") {
              window.location.href = "admin-dashboard.html";
            } else {
              window.location.href = "dashboard.html";
            }
          } else {
            alert(data.error || "登入失敗");
          }
        })
        .catch((error) => alert("登入錯誤：" + error));
    }
  });
});
