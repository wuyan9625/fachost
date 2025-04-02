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
  const authSwitch = document.getElementById("switch-to-register");

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
      window.location.href = "/";  // 重定向回首頁
    });
  }

  // 切換到註冊頁面
  if (authSwitch) {
    authSwitch.addEventListener("click", () => {
      const authTitle = document.getElementById("auth-title");
      const submitBtn = document.getElementById("submit-auth");
      const confirmPasswordGroup = document.getElementById("confirm-password-group");
      const verificationGroup = document.getElementById("verification-group");

      // 更新標題和按鈕文字
      authTitle.textContent = "註冊";
      submitBtn.textContent = "註冊";

      // 顯示確認密碼輸入框
      confirmPasswordGroup.classList.remove("hidden");
      
      // 顯示驗證碼
      verificationGroup.classList.remove("hidden");
      
      // 切換到註冊 API 提交邏輯
      authForm.removeEventListener("submit", handleLoginSubmit);
      authForm.addEventListener("submit", handleRegisterSubmit);
    });
  }

  // 登入提交事件
  if (authForm) {
    authForm.addEventListener("submit", handleLoginSubmit);
  }
}

// 登入提交事件
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch("https://api.fachost.cloud/api/login", {
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

      // 根據角色跳轉到不同頁面
      if (data.role === 'admin') {
        window.location.href = "admin-dashboard.html";  // 管理員頁面
      } else {
        window.location.href = "dashboard.html";  // 一般用戶頁面
      }
    } else {
      alert(data.error || "登入失敗");
    }
  })
  .catch(err => {
    alert("伺服器錯誤，請稍後再試");
    console.error(err);
  });
}

// 註冊提交事件
function handleRegisterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (password !== confirmPassword) {
    alert("密碼和確認密碼不一致！");
    return;
  }

  fetch("https://api.fachost.cloud/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      alert("✅ 註冊成功！");
      localStorage.setItem("jwt_token", data.token);
      localStorage.setItem("role", data.role);  // 記錄角色
      document.getElementById("auth-modal").classList.add("hidden");

      // 根據角色跳轉到不同頁面
      if (data.role === 'admin') {
        window.location.href = "admin-dashboard.html";  // 管理員頁面
      } else {
        window.location.href = "dashboard.html";  // 一般用戶頁面
      }
    } else {
      alert(data.error || "註冊失敗");
    }
  })
  .catch(err => {
    alert("伺服器錯誤，請稍後再試");
    console.error(err);
  });
}
