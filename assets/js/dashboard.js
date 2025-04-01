document.addEventListener("DOMContentLoaded", () => {
  const vpsListContainer = document.getElementById("vps-list");
  const logoutBtn = document.getElementById("logout-btn");

  // 取得用戶的 VPS 資訊
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

  // 渲染 VPS 列表
  function renderVpsList(vpsList) {
    vpsListContainer.innerHTML = "";

    if (vpsList.length === 0) {
      vpsListContainer.innerHTML = "<p>您目前沒有任何 VPS。</p>";
    }

    vpsList.forEach(async (vps) => {
      const vpsCard = document.createElement("div");
      vpsCard.className = "vps-card";

      // 取得 VPS 當日流量資訊
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
      `;

      vpsListContainer.appendChild(vpsCard);
    });
  }

  // 取得 VPS 當日流量資料
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

  // VPS 控制功能：開啟/關閉
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
        fetchVpsList(); // 重新加載 VPS 列表
      } catch (error) {
        alert("操作失敗，請稍後再試！");
      }
    }
  }

  // 刷新 IP
async function refreshIp(vpsId) {
  const action = confirm("您確定要刷新 VPS IP 嗎？");

  if (action) {
    try {
      const response = await fetch(`/api/vps/${vpsId}/refresh-ip`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(`IP 刷新成功！新的 IP 地址為：${data.new_ip}`);
        fetchVpsList(); // 重新加載 VPS 列表
      } else {
        alert(data.error || "刷新失敗！");
      }
    } catch (error) {
      alert("刷新 IP 失敗，請稍後再試！");
    }
  }
}

  // 註冊登出事件
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jwt_token"); // 清除 token
      window.location.href = "index.html"; // 重定向到首頁
    });
  }

  // 初始加載用戶的 VPS 資訊
  fetchVpsList();
});
