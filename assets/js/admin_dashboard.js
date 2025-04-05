document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("請先登入");
    location.href = "/";
    return;
  }

  // 驗證是否為管理員
  fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.role !== "admin") {
        alert("此頁面僅限管理員使用");
        location.href = "/";
      } else {
        loadAdminData();
      }
    });

  function loadAdminData() {
    loadUsers();
    loadVPS();
    loadPlans();
  }

  // ✅ 載入用戶列表
  function loadUsers() {
    fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const userBox = document.getElementById("user-list");
        userBox.innerHTML = "";

        data.users.forEach((user) => {
          const div = document.createElement("div");
          div.innerHTML = `<b>${user.email}</b> (${user.role})`;
          userBox.appendChild(div);
        });
      });
  }

  // ✅ 載入 VPS
  function loadVPS() {
    fetch("/api/admin/vps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const vpsBox = document.getElementById("vps-list");
        vpsBox.innerHTML = "";

        data.vps_list.forEach((vps) => {
          const div = document.createElement("div");
          div.innerHTML = `
            <b>${vps.name}</b> - IP: ${vps.ip}
            <button class="btn-delete" data-id="${vps.id}">刪除</button>
          `;
          vpsBox.appendChild(div);
        });

        document.querySelectorAll(".btn-delete").forEach((btn) => {
          btn.onclick = async () => {
            const id = btn.dataset.id;
            if (confirm("確定刪除 VPS？")) {
              const res = await fetch(`/api/admin/vps/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              const result = await res.json();
              alert(result.msg || "刪除成功");
              loadVPS();
            }
          };
        });
      });
  }

  // ✅ 建立新套餐
  const createPlanForm = document.getElementById("create-plan-form");
  createPlanForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("plan-name").value;
    const price = document.getElementById("plan-price").value;

    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price }),
    });
    const result = await res.json();
    alert(result.msg || "建立成功");
    loadPlans();
  };

  // ✅ 套餐列表
  function loadPlans() {
    fetch("/api/admin/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const box = document.getElementById("plan-list");
        box.innerHTML = "";
        data.plans.forEach((p) => {
          const div = document.createElement("div");
          div.innerText = `${p.name} - $${p.price}`;
          box.appendChild(div);
        });
      });
  }
});
