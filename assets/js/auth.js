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

    // 註冊時檢查密碼與確認密碼是否一致
    if (isRegister && password !== confirmPassword) {
      alert("密碼與確認密碼不一致！");
      return;
    }

    // 構建請求 payload，根據是否是註冊模式加入驗證碼
    const payload = {
      email,
      password,
      ...(isRegister ? { code: verificationCode } : {})
    };

    try {
      // 根據模式選擇相應的 API
      const res = await fetch(isRegister ? "/api/register" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(isRegister ? "註冊成功！" : "登入成功！");
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("role", data.role);  // 儲存角色

        // 根據角色進行頁面跳轉
        if (data.role === "admin") {
          window.location.href = "admin-dashboard.html";  // 管理員跳轉到管理後台
        } else {
          window.location.href = "dashboard.html";  // 普通用戶跳轉到控制台
        }
      } else {
        alert(data.message || "操作失敗");
      }
    } catch (err) {
      alert("無法連接伺服器");
    }
  });
});
