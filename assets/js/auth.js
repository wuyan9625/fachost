document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const forgotModal = document.getElementById("forgot-password-modal");
  const loginBtn = document.getElementById("login-btn");
  const closeModal = document.getElementById("close-modal");
  const switchToRegister = document.getElementById("switch-to-register");
  const authForm = document.getElementById("auth-form");
  const authTitle = document.getElementById("auth-title");
  const submitAuth = document.getElementById("submit-auth");
  const confirmGroup = document.getElementById("confirm-password-group");
  const verificationGroup = document.getElementById("verification-group");
  const sendCodeBtn = document.getElementById("send-code");
  const switchToLogin = document.getElementById("auth-switch");
  const forgotLink = document.getElementById("forgot-password-link");
  const closeForgot = document.getElementById("close-forgot-password-modal");
  const forgotForm = document.getElementById("forgot-password-form");

  let isLogin = true;

  loginBtn.onclick = () => {
    modal.classList.remove("hidden");
    isLogin = true;
    updateForm();
  };

  closeModal.onclick = () => {
    modal.classList.add("hidden");
  };

  switchToRegister.onclick = (e) => {
    e.preventDefault();
    isLogin = false;
    updateForm();
  };

  switchToLogin.onclick = (e) => {
    e.preventDefault();
    isLogin = true;
    updateForm();
  };

  forgotLink.onclick = (e) => {
    e.preventDefault();
    modal.classList.add("hidden");
    forgotModal.classList.remove("hidden");
  };

  closeForgot.onclick = () => {
    forgotModal.classList.add("hidden");
  };

  sendCodeBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    if (!email) return alert("請輸入 Email");

    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      alert(result.msg || "已發送驗證碼");
    } catch (err) {
      alert("發送失敗，請稍後再試");
    }
  };

  authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (isLogin) {
      // 登入
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await res.json();
        if (res.ok) {
          alert("登入成功！");
          localStorage.setItem("token", result.token || result.uid);
          modal.classList.add("hidden");
          location.reload();
        } else {
          alert(result.msg || "登入失敗");
        }
      } catch (err) {
        alert("伺服器錯誤，請稍後再試");
      }
    } else {
      // 註冊
      const confirm = document.getElementById("confirm-password").value;
      const code = document.getElementById("verification-code").value;

      if (password !== confirm) return alert("兩次密碼不一致");

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirm, code }),
        });

        const result = await res.json();
        if (res.ok) {
          alert("註冊成功！");
          localStorage.setItem("token", result.token || result.uid);
          modal.classList.add("hidden");
          location.reload();
        } else {
          alert(result.msg || "註冊失敗");
        }
      } catch (err) {
        alert("伺服器錯誤，請稍後再試");
      }
    }
  };

  forgotForm.onsubmit = async (e) => {
    e.preventDefault();
    alert("此功能尚未實作");
    // 可後續補上 reset-password API
  };

  function updateForm() {
    authTitle.textContent = isLogin ? "登入" : "註冊";
    submitAuth.textContent = isLogin ? "登入" : "註冊";
    confirmGroup.classList.toggle("hidden", isLogin);
    verificationGroup.classList.toggle("hidden", isLogin);
    forgotLink.classList.toggle("hidden", !isLogin);
  }
});
