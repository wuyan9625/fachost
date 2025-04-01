document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");

  // 登入彈窗顯示邏輯
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");  // 顯示登入彈窗
      setAuthMode("login");  // 設定為登入模式
    });
  }

  // 關閉彈窗
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");  // 隱藏登入/註冊彈窗
  });

  // 點擊 modal 外部區域關閉彈窗
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 模式切換（登入與註冊）
  const switchLink = document.getElementById("switch-to-register");
  const authTitle = document.getElementById("auth-title");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const submitBtn = document.getElementById("submit-auth");
  let mode = "login";  // 默認模式為登入

  // 切換登入/註冊模式
  switchLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (mode === "login") {
      setAuthMode("register");  // 切換到註冊模式
    } else {
      setAuthMode("login");  // 切換到登入模式
    }
  });

  // 設置不同模式下表單顯示
  function setAuthMode(type) {
    mode = type;
    if (type === "register") {
      authTitle.textContent = "註冊";
      confirmGroup.classList.remove("hidden");  // 顯示確認密碼欄位
      verificationGroup.classList.remove("hidden");  // 顯示驗證碼欄位
      submitBtn.textContent = "註冊";
    } else {
      authTitle.textContent = "登入";
      confirmGroup.classList.add("hidden");  // 隱藏確認密碼欄位
      verificationGroup.classList.add("hidden");  // 隱藏驗證碼欄位
      submitBtn.textContent = "登入";
    }
  }

  // 發送驗證碼功能（假設已與後端對接）
  const sendCodeBtn = document.getElementById("send-code");
  sendCodeBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    if (!email) {
      alert("請先輸入 Email！");
      return;
    }
    // 實際應該發 POST 請求，並由後端處理發送驗證碼
    fetch("/api/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(response => response.json())
      .then(data => alert(`驗證碼已發送至：${email}`))
      .catch(error => alert("發送驗證碼失敗：" + error));
  });

  // 處理表單提交（登入或註冊）
  document.getElementById("auth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (mode === "register") {
      const confirmPassword = document.getElementById("confirm-password").value;
      const verificationCode = document.getElementById("verification-code").value;

      // 註冊 API 調用
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword, verificationCode })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("註冊成功！");
            modal.classList.add("hidden");
          } else {
            alert(data.error || "註冊失敗");
          }
        })
        .catch(error => alert("錯誤: " + error));
    } else {
      // 登入 API 調用
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("jwt_token", data.token);
            localStorage.setItem("role", data.role);  // 儲存角色
            // 根據角色進行頁面跳轉
            if (data.role === "admin") {
              window.location.href = "admin-dashboard.html";  // 管理員跳轉到管理後台
            } else {
              window.location.href = "dashboard.html";  // 普通用戶跳轉到控制台
            }
          } else {
            alert("登入失敗");
          }
        })
        .catch(error => alert("錯誤: " + error));
    }
  });
});
