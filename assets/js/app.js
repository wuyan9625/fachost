document.addEventListener("DOMContentLoaded", () => {
  // 語言切換，這部分可根據需求刪除或實現
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

  // 切換註冊/登入模式
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

  // 註冊表單提交
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (mode === "register") {
      // 註冊邏輯
      if (password !== confirmPassword) {
        alert("密碼不一致！");
        return;
      }
      if (!document.getElementById("accept-terms").checked) {
        alert("請同意服務條款");
        return;
      }

      // 向後端發送註冊請求
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }).then((res) => res.json()).then((data) => {
        if (data.message === "註冊成功") {
          alert("註冊成功，請登錄！");
          // 可以選擇自動切換到登入模式
        } else {
          alert(data.error || "註冊失敗");
        }
      }).catch(err => alert("註冊錯誤：" + err));
    } else {
      // 登錄邏輯
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }).then((res) => res.json()).then((data) => {
        if (data.message === "登入成功") {
          alert("登入成功！");
          // 登錄後的操作，如跳轉到控制台
        } else {
          alert(data.error || "登入失敗");
        }
      }).catch(err => alert("登入錯誤：" + err));
    }
  });

  // 發送驗證碼（未串後端，佔位用）
  const sendCodeBtn = document.getElementById("send-code");
  sendCodeBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    if (!email) {
      alert("請先輸入 Email！");
      return;
    }
    alert(`驗證碼已發送至：${email}（示意）`);
    // 實際應發 POST 請求給後端發送驗證碼
  });
});
