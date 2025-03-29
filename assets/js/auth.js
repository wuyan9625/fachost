document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  if (!authForm) return;

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password")?.value;
    const verificationCode = document.getElementById("verification-code")?.value;
    const isRegister = !document.getElementById("confirm-password-group").classList.contains("hidden");

    if (isRegister && password !== confirmPassword) {
      alert("密碼與確認密碼不一致！");
      return;
    }

    const payload = {
      email,
      password,
      ...(isRegister ? { code: verificationCode } : {})
    };

    try {
      const res = await fetch(isRegister ? "/api/register" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(isRegister ? "註冊成功！" : "登入成功！");
        location.reload();
      } else {
        alert(data.message || "操作失敗");
      }
    } catch (err) {
      alert("無法連接伺服器");
    }
  });
});
