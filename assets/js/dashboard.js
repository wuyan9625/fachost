document.addEventListener("DOMContentLoaded", () => {
  const vpsListContainer = document.getElementById("vps-list");

  async function fetchVpsList() {
    try {
      const token = localStorage.getItem("jwt_token");
      const uid = parseJwt(token)?.uid;
      if (!uid) return alert("請重新登入");

      const response = await fetch(`/api/vps/${uid}`);
      const data = await response.json();

      if (response.ok) {
        renderVpsList(data);
      } else {
        alert(data.message || "無法加載 VPS 資訊");
      }
    } catch (err) {
      console.error("錯誤:", err);
      alert("伺服器錯誤");
    }
  }

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  async function getVpsTraffic(vpsId) {
    try {
      const res = await fetch(`/api/vps/${vpsId}/traffic`);
      return await res.json();
    } catch (err) {
      console.error("無法取得流量資訊", err);
      return {
        used_traffic: 0,
        limit_traffic: 0,
        remaining_traffic: 0
      };
    }
  }

  function renderVpsList(vpsList) {
    vpsListContainer.innerHTML = "";

    if (vpsList.length === 0) {
      vpsListContainer.innerHTML = "<p>您目前沒有任何 VPS。</p>";
    }

    vpsList.forEach(async (vps) => {
      const vpsCard = document.createElement("div");
      vpsCard.className = "vps-card";

      const traffic = await getVpsTraffic(vps.id);

      const modeOptions = `
        <option value="manual" ${vps.refresh_mode === 'manual' ? 'selected' : ''}>手動</option>
        <option value="auto" ${vps.refresh_mode === 'auto' ? 'selected' : ''}>自動</option>
      `;

      const timeSelect = `
        <select class="refresh-time-select" data-vps-id="${vps.id}" style="${vps.refresh_mode === 'auto' ? '' : 'display:none'}">
          <option value="03:00" ${vps.refresh_time === "03:00" ? "selected" : ""}>03:00</option>
          <option value="06:00" ${vps.refresh_time === "06:00" ? "selected" : ""}>06:00</option>
          <option value="12:00" ${vps.refresh_time === "12:00" ? "selected" : ""}>12:00</option>
        </select>
      `;

      vpsCard.innerHTML = `
        <h3>VPS ID: ${vps.id}</h3>
        <p>IP: ${vps.ip}</p>
        <p>狀態: ${vps.status}</p>
        <p>剩餘天數: ${vps.days_left} 天</p>
        <p>流量使用：${traffic.used_traffic} / ${traffic.limit_traffic} GB</p>
        <p>剩餘：${traffic.remaining_traffic} GB</p>
        <p>刷新模式：
          <select class="refresh-mode-select" data-vps-id="${vps.id}">
            ${modeOptions}
          </select>
          ${timeSelect}
        </p>
        <button onclick="refreshIp('${vps.id}')">刷新 IP</button>
      `;

      vpsListContainer.appendChild(vpsCard);
    });

    // 切換刷新模式
    document.querySelectorAll(".refresh-mode-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const mode = e.target.value;
        const vpsId = e.target.dataset.vpsId;
        const timeSelect = document.querySelector(`.refresh-time-select[data-vps-id="${vpsId}"]`);

        if (mode === "auto") {
          timeSelect.style.display = "";
        } else {
          timeSelect.style.display = "none";
        }

        const payload = {
          mode,
          time: mode === "auto" ? timeSelect.value : null
        };

        const res = await fetch(`/api/vps/${vpsId}/set-refresh-mode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert(data.message || data.error);
      });
    });

    // 修改自動時間選單
    document.querySelectorAll(".refresh-time-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const time = e.target.value;
        const vpsId = e.target.dataset.vpsId;

        const res = await fetch(`/api/vps/${vpsId}/set-refresh-mode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mode: "auto",
            time
          })
        });

        const data = await res.json();
        alert(data.message || data.error);
      });
    });
  }

  window.refreshIp = async function (vpsId) {
    const ok = confirm("是否要刷新 IP？");
    if (!ok) return;

    const res = await fetch(`/api/vps/${vpsId}/refresh`, {
      method: "POST"
    });
    const data = await res.json();
    if (res.ok) {
      alert("已刷新 IP：" + data.new_ip);
      fetchVpsList();
    } else {
      alert(data.error || "刷新失敗");
    }
  };

  fetchVpsList();
});
