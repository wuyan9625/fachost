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
      const name = document.getElementById("name")?.value.trim() || email;

      if (password !== confirmPassword) return alert("兩次密碼不一致！");

      // 先驗證驗證碼
      fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) return alert(data.error || "驗證失敗");

          // 驗證成功 → 註冊
          return fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name })
          });
        })
        .then(res => res?.json?.())
        .then(data => {
          if (data?.message === "註冊成功") {
            alert("✅ 註冊成功！");
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
            window.location.href = "plans.html";
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
