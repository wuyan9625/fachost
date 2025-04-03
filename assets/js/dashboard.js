document.addEventListener("DOMContentLoaded", () => {
  const vpsListContainer = document.getElementById("vps-list");
  const trafficRankContainer = document.getElementById("traffic-ranking");

  const token = localStorage.getItem("jwt_token");
  const user = parseJwt(token);
  const isAdmin = user?.role === "admin";
  const uid = user?.uid;

  if (!token || !uid) {
    alert("請重新登入");
    return;
  }

  if (isAdmin && trafficRankContainer) {
    fetchAdminTrafficRanking();
  } else {
    fetchUserVpsList(uid);
  }

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  async function fetchUserVpsList(uid) {
    try {
      const res = await fetch(`/api/vps/${uid}`);
      const vpsList = await res.json();

      if (Array.isArray(vpsList)) {
        renderVpsList(vpsList);
      } else {
        alert(vpsList.error || "無法加載 VPS");
      }
    } catch (err) {
      console.error(err);
      alert("伺服器錯誤");
    }
  }

  async function getVpsTraffic(vpsId) {
    try {
      const res = await fetch(`/api/vps/${vpsId}/traffic`);
      return await res.json();
    } catch {
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
      vpsListContainer.innerHTML = "<p>目前沒有 VPS。</p>";
      return;
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

    bindRefreshModeEvents();
  }

  function bindRefreshModeEvents() {
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert(data.message || data.error);
      });
    });

    document.querySelectorAll(".refresh-time-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const time = e.target.value;
        const vpsId = e.target.dataset.vpsId;

        const res = await fetch(`/api/vps/${vpsId}/set-refresh-mode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "auto", time })
        });

        const data = await res.json();
        alert(data.message || data.error);
      });
    });
  }

  window.refreshIp = async function (vpsId) {
    if (!confirm("是否要刷新 IP？")) return;

    const res = await fetch(`/api/vps/${vpsId}/refresh`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      alert("IP 已刷新：" + data.new_ip);
      location.reload();
    } else {
      alert(data.error || "刷新失敗");
    }
  };

  async function fetchAdminTrafficRanking() {
    try {
      const res = await fetch("/api/admin/vps/traffic-ranking");
      const list = await res.json();

      if (!Array.isArray(list)) return alert("無法載入排行榜");

      trafficRankContainer.innerHTML = "<h2>全站流量排行</h2><ul>";

      list.forEach((vps, i) => {
        trafficRankContainer.innerHTML += `
          <li>#${i + 1} - ${vps.email} (${vps.vps_id})：${(vps.traffic / 1024).toFixed(2)} GB</li>
        `;
      });

      trafficRankContainer.innerHTML += "</ul>";
    } catch (err) {
      console.error("流量排行讀取錯誤", err);
    }
  }
});
