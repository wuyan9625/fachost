document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("請先登入！");
    window.location.href = "/";
    return;
  }

  // ✅ 載入使用者 VPS 列表
  fetch("/api/vps", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200 && Array.isArray(data.vps_list)) {
        renderVPS(data.vps_list);
      } else {
        alert(data.msg || "取得 VPS 失敗");
      }
    })
    .catch(() => {
      alert("伺服器錯誤，無法載入");
    });

  // ✅ 渲染 VPS 卡片
  function renderVPS(list) {
    const container = document.getElementById("vps-container");
    container.innerHTML = "";

    list.forEach((vps) => {
      const card = document.createElement("div");
      card.className = "vps-card";
      card.innerHTML = `
        <h3>${vps.name || "VPS"}</h3>
        <p>IP：${vps.ip}</p>
        <p>狀態：${vps.status}</p>
        <p>刷新模式：${vps.refresh_mode || "手動"}</p>
        <button class="refresh-btn" data-id="${vps.id}">刷新 IP</button>
        <select class="mode-select" data-id="${vps.id}">
          <option value="manual" ${vps.refresh_mode === "manual" ? "selected" : ""}>手動</option>
          <option value="auto" ${vps.refresh_mode === "auto" ? "selected" : ""}>自動</option>
        </select>
      `;
      container.appendChild(card);
    });

    // 綁定刷新按鈕
    document.querySelectorAll(".refresh-btn").forEach((btn) => {
      btn.onclick = async () => {
        const vpsId = btn.dataset.id;
        try {
          const res = await fetch(`/api/vps/${vpsId}/refresh`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          alert(result.msg || "已發送刷新指令");
        } catch {
          alert("刷新失敗");
        }
      };
    });

    // 綁定模式選擇
    document.querySelectorAll(".mode-select").forEach((select) => {
      select.onchange = async () => {
        const vpsId = select.dataset.id;
        const mode = select.value;
        try {
          const res = await fetch(`/api/vps/${vpsId}/mode`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mode }),
          });
          const result = await res.json();
          alert(result.msg || "模式已更新");
        } catch {
          alert("模式切換失敗");
        }
      };
    });
  }
});
