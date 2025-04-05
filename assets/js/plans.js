document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("請先登入後再購買！");
    window.location.href = "/";
    return;
  }

  document.querySelectorAll(".buy-button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const planId = btn.dataset.planId;

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan_id: planId }),
        });

        const result = await res.json();
        if (res.ok) {
          alert("訂單建立成功，請前往付款");
          // 你可以改成自動跳轉：window.location.href = `/pay.html?order_id=${result.order_id}`
        } else {
          alert(result.msg || "下單失敗");
        }
      } catch (err) {
        alert("伺服器錯誤，請稍後再試");
      }
    });
  });
});
