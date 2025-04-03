document.addEventListener("DOMContentLoaded", () => {
  const vpsListContainer = document.getElementById("vps-list");
  const logoutBtn = document.getElementById("logout-btn");

  async function fetchVpsList() {
    try {
      const response = await fetch("/api/vps", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        renderVpsList(data);
      } else {
        alert(data.message || "無法加載 VPS 資訊");
      }
    } catch (error) {
      console.error("無法取得 VPS 資訊:", error);
      alert("無法連接伺服器，請稍後再試！");
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
      const trafficData = await getVpsTraffic(vps.id);

      vpsCard.innerHTML = `
        <h3>VPS ID: ${vps.id}</h3>
        <p>IP 地址: ${vps.ip}</p>
        <p>狀態: ${vps.status}</p>
        <p>套餐: ${vps.plan_name}</p>
        <p>當日流量使用: ${trafficData.used_traffic} / ${trafficData.limit_traffic} GB</p>
        <p>剩餘流量: ${trafficData.remaining_traffic} GB</p>
        <button onclick="toggleVpsStatus('${vps.id}')">${vps.status === 'running' ? '關閉 VPS' : '開啟 VPS'}</button>
        <button onclick="refreshIp('${vps.id}')">刷新 IP</button>
        <select onchange="setRefreshMode('${vps.id}', this.value)" id="mode-${vps.id}">
          <option value="manual" ${vps.refresh_mode === 'manual' ? 'selected' : ''}>手動</option>
          <option value="auto" ${vps.refresh_mode === 'auto' ? 'selected' : ''}>自動</option>
        </select>
        <select id="time-${vps.id}" style="display: ${vps.refresh_mode === 'auto' ? 'inline' : 'none'};" onchange="saveRefreshTime('${vps.id}')">
          <option value="03:00" ${vps.refresh_time === '03:00' ? 'selected' : ''}>03:00</option>
          <option value="06:00" ${vps.refresh_time === '06:00' ? 'selected' : ''}>06:00</option>
          <option value="12:00" ${vps.refresh_time === '12:00' ? 'selected' : ''}>12:00</option>
        </select>
      `;

      vpsListContainer.appendChild(vpsCard);
    });
  }

  async function getVpsTraffic(vpsId) {
    try {
      const response = await fetch(`/api/vps/${vpsId}/traffic`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("無法取得流量資料:", error);
      return {
        used_traffic: 0,
        limit_traffic: 0,
        remaining_traffic: 0,
      };
    }
  }

  async function toggleVpsStatus(vpsId) {
    const action = confirm("您確定要切換 VPS 狀態嗎？");
    if (action) {
      try {
        const response = await fetch(`/api/vps/${vpsId}/toggle`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
        const data = await response.json();
        alert(data.message);
        fetchVpsList();
      } catch (error) {
        alert("操作失敗，請稍後再試！");
      }
    }
  }

  async function refreshIp(vpsId) {
    const action = confirm("您確定要刷新 VPS IP 嗎？");
    if (action) {
      try {
        const response = await fetch(`/api/vps/${vpsId}/refresh`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          alert(`IP 刷新成功！新的 IP 地址為：${data.new_ip}`);
          fetchVpsList();
        } else {
          alert(data.error || "刷新失敗！");
        }
      } catch (error) {
        alert("刷新 IP 失敗，請稍後再試！");
      }
    }
  }

  window.setRefreshMode = (vpsId, mode) => {
    const timeSelect = document.getElementById(`time-${vpsId}`);
    if (mode === "auto") {
      timeSelect.style.display = "inline";
    } else {
      timeSelect.style.display = "none";
    }

    const selectedTime = timeSelect.value;

    fetch(`/api/vps/${vpsId}/set-refresh-mode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mode, time: selectedTime })
    })
      .then(res => res.json())
      .then(data => alert(data.message || data.error || "設定失敗"))
      .catch(err => alert("錯誤：" + err));
  };

  window.saveRefreshTime = (vpsId) => {
    const time = document.getElementById(`time-${vpsId}`).value;
    fetch(`/api/vps/${vpsId}/set-refresh-mode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "auto",
        time: time
      })
    })
      .then(res => res.json())
      .then(data => alert(data.message || data.error || "定時時間更新失敗"))
      .catch(err => alert("更新時間錯誤：" + err));
  };

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jwt_token");
      window.location.href = "index.html";
    });
  }

  fetchVpsList();
});
