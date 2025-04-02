document.addEventListener("DOMContentLoaded", () => {
  // 其他代碼...

  // 套餐創建事件
  const createPlanForm = document.getElementById("create-plan-form");
  if (createPlanForm) {
    createPlanForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const planData = {
        id: document.getElementById("plan-id").value,
        region: document.getElementById("region").value,
        cpu: document.getElementById("cpu").value,
        ram: document.getElementById("ram").value,
        ram_unit: document.getElementById("ram-unit").value,
        disk: document.getElementById("disk").value,
        bandwidth: document.getElementById("bandwidth").value,
        price: document.getElementById("price").value,
        currency: document.getElementById("currency").value,
        server_id: document.getElementById("server-id").value,
        is_under_construction: document.getElementById("is-under-construction").checked,
      };

      fetch("https://api.fachost.cloud/api/plans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message || "套餐創建成功！");
        })
        .catch((err) => {
          alert("創建套餐失敗：" + err);
        });
    });
  }
});
