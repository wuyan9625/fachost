// ✅ admin 功能：套餐新增 + VPS 開通 + 用戶查詢 + VPS 控制

const API_BASE = "/api";

// ✅ 查詢用戶資訊
function getUserInfo() {
  const uid = document.getElementById("user-id").value.trim();
  if (!uid) return alert("請輸入用戶 UID");

  fetch(`${API_BASE}/user/${uid}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return alert(data.error);
      document.getElementById("user-uid").textContent = data.uid;
      document.getElementById("user-email").textContent = data.email;
      document.getElementById("user-name").textContent = data.name || "(未設定)";
      document.getElementById("user-is-admin").textContent = data.role === "admin" ? "是" : "否";
    })
    .catch(err => alert("查詢錯誤: " + err));
}

// ✅ 查詢用戶流量（此 API 需後端支援）
function getUserTraffic() {
  const uid = document.getElementById("traffic-user-id").value.trim();
  if (!uid) return alert("請輸入 UID");

  fetch(`${API_BASE}/traffic/${uid}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("traffic-list");
      list.innerHTML = "";
      data.records?.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `時間：${item.date}，使用：${item.amount} MB`;
        list.appendChild(li);
      });
    })
    .catch(err => alert("查詢錯誤: " + err));
}

// ✅ 手動開通 VPS
function createVPS() {
  const uid = document.getElementById("user-uid").value.trim();
  const planId = document.getElementById("plan-id").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!uid || !planId || !username || !password) return alert("請填寫所有欄位");

  fetch(`${API_BASE}/admin/create-vps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
    },
    body: JSON.stringify({ uid, plan_id: planId, username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) alert(data.message);
      else alert(data.error || "建立失敗");
    })
    .catch(err => alert("開通錯誤: " + err));
}

// ✅ 創建方案
function createPlan() {
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

  fetch("/api/plans/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
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
}

// ✅ VPS 開關
function enableVPS() { toggleVPS("enable"); }
function disableVPS() { toggleVPS("disable"); }
function toggleVPS(action) {
  const vpsId = document.getElementById("vps-id").value.trim();
  if (!vpsId) return alert("請輸入 VPS ID");

  fetch(`${API_BASE}/admin/vps/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
    },
    body: JSON.stringify({ vps_id: vpsId })
  })
    .then(res => res.json())
    .then(data => alert(data.message || data.error || `${action} VPS 失敗`))
    .catch(err => alert(`${action} 錯誤: ` + err));
}
