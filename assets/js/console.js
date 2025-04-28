document.addEventListener('DOMContentLoaded', function () {

    // ========= 顯示自己名下的VPS列表 =========
    async function loadMyVps() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('請先登入！');
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`https://api.fachost.cloud/api/vps/my-vps?user_id=${userId}`);
            const data = await response.json();

            const vpsListDiv = document.getElementById('vps-list');
            if (!vpsListDiv) {
                console.error('找不到 vps-list 的容器');
                return;
            }

            vpsListDiv.innerHTML = ''; // 清空舊資料

            data.vps_list.forEach(vps => {
                const vpsDiv = document.createElement('div');
                vpsDiv.classList.add('vps-item');
                vpsDiv.setAttribute('data-vps-id', vps.id);

                vpsDiv.innerHTML = `
                    <h3>${vps.hostname || 'VPS'} - ${vps.ip_address}</h3>
                    <p>到期日：${vps.end_date}</p>
                    <button onclick="refreshVps(${vps.id})">刷新 IP</button>
                    <p id="refresh-status-${vps.id}" class="refresh-status"></p>
                `;

                vpsListDiv.appendChild(vpsDiv);
            });

        } catch (error) {
            console.error('載入VPS列表失敗:', error);
        }
    }

    // ========= 刷新 VPS IP（撥號） =========
    window.refreshVps = async function (vpsId) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/refresh-ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vps_id: vpsId })
            });

            const result = await response.json();
            const statusElement = document.getElementById(`refresh-status-${vpsId}`);
            if (result.success) {
                statusElement.textContent = '刷新成功！新IP已生效';
                statusElement.style.color = 'green';
            } else {
                statusElement.textContent = '刷新失敗: ' + result.message;
                statusElement.style.color = 'red';
            }
        } catch (error) {
            alert('刷新出錯，請稍後再試');
        }
    };

    // ========= 頁面載入時自動載入 VPS列表 =========
    loadMyVps();

});
