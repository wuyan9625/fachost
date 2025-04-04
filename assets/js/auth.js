document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  const sendCodeBtn = document.getElementById("send-code");

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mode = window.getAuthMode?.() || "login";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("請輸入完整資訊");

    if (mode === "register") {
      const confirmPassword = document.getElementById("confirm-password").value.trim();
      const code = document.getElementById("verification-code").value.trim();
      const name = document.getElementById("name")?.value.trim() || email;

      if (password !== confirmPassword) return alert("兩次密碼不一致");

      try {
        // 先驗證驗證碼
        const verifyRes = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) return alert(verifyData.error || "驗證失敗");

        // 驗證成功 → 註冊
        const registerRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const registerData = await registerRes.json();
        if (registerData.message === "註冊成功") {
          alert("✅ 註冊成功！");
          document.getElementById("auth-modal").classList.add("hidden");
        } else {
          alert(registerData.error || "註冊失敗");
        }
      } catch (err) {
        alert("註冊流程錯誤: " + err.message);
      }
    } else {
      // 登入流程
      try {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
          localStorage.setItem("jwt_token", loginData.token);
          localStorage.setItem("role", loginData.role);
          document.getElementById("auth-modal").classList.add("hidden");
          window.location.href = "plans.html";
        } else {
          alert(loginData.error || "登入失敗");
        }
      } catch (err) {
        alert("登入錯誤: " + err.message);
      }
    }
  });

  sendCodeBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) return alert("請先輸入 Email");

    try {
      const res = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message || data.error || "未知錯誤");
    } catch (err) {
      alert("發送錯誤: " + err.message);
    }
  });
});
