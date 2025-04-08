document.addEventListener('DOMContentLoaded', function () {

    // 顯示註冊表單
    document.getElementById('switch-to-register').addEventListener('click', function () {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    });

    // 顯示登錄表單
    document.getElementById('switch-to-login').addEventListener('click', function () {
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
    });

    // 登錄按鈕點擊事件
    document.getElementById('login-btn').addEventListener('click', function () {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
    });

    // 註冊按鈕點擊事件
    document.getElementById('register-btn').addEventListener('click', function () {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
        document.getElementById('login-form-container').classList.add('hidden');
    });

    // 關閉模態窗口
    document.getElementById('close-modal').addEventListener('click', function () {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // 登錄表單提交
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://api.fachost.cloud/api/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('token', data.token);
                alert('登入成功');
                window.location.href = 'console.html';
            } else {
                alert('登入失敗: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 發送註冊驗證碼
    document.getElementById('send-code-btn').addEventListener('click', async function () {
        const email = document.getElementById('register-email').value;
        if (!email) {
            alert('請先輸入 Email');
            return;
        }

        try {
            const response = await fetch('https://api.fachost.cloud/api/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('發送驗證碼失敗：' + error.message);
        }
    });

    // 註冊表單提交
    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const code = document.getElementById('register-code').value;

        try {
            const response = await fetch('https://api.fachost.cloud/api/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, code })
            });
            const data = await response.json();
            if (data.message === "註冊成功") {
                alert('註冊成功，請登入');
                window.location.href = 'index.html';
            } else {
                alert('註冊失敗: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // 創建套餐
    document.getElementById('create-plan-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const planData = {
            name: document.getElementById('plan-name').value,
            description: document.getElementById('plan-description').value,
            price: parseFloat(document.getElementById('plan-price').value),
            duration: document.getElementById('plan-duration').value,
            total_vps: parseInt(document.getElementById('plan-total-vps').value)
        };

        try {
            const response = await fetch('https://api.fachost.cloud/api/api/vps/create-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 更新套餐
    document.getElementById('update-plan-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const planData = {
            price: parseFloat(document.getElementById('new-price').value),
            total_vps: parseInt(document.getElementById('new-total-vps').value)
        };

        const planId = document.getElementById('plan-id').value;

        try {
            const response = await fetch(`https://api.fachost.cloud/api/api/vps/update-plan/${planId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 取得套餐
    async function fetchPlans() {
        try {
            const response = await fetch('https://api.fachost.cloud/api/api/vps/get-plans');
            const data = await response.json();
            const planListDiv = document.getElementById('plan-list');
            data.plans.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-item');
                planDiv.setAttribute('data-plan-id', plan.id);
                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>描述：${plan.description}</p>
                    <p>價格：${plan.price}</p>
                    <p>總量：${plan.total_vps}</p>
                    <p class="available-vps">可用：${plan.available_vps}</p>
                    <button onclick="purchaseVps(${plan.id})">購買</button>
                `;
                planListDiv.appendChild(planDiv);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    fetchPlans();

    // 購買 VPS
    window.purchaseVps = async function (planId) {
        const userId = getUserId();

        const data = {
            user_id: userId,
            plan_id: planId
        };

        try {
            const response = await fetch('https://api.fachost.cloud/api/api/vps/create-vps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.message === "VPS 创建成功") {
                alert("購買成功！");
                updatePlanStock(planId);
            } else {
                alert("購買失敗：" + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 更新庫存數量
    function updatePlanStock(planId) {
        const planDiv = document.querySelector(`.plan-item[data-plan-id="${planId}"]`);
        const availableVps = planDiv.querySelector('.available-vps');
        availableVps.textContent = parseInt(availableVps.textContent) - 1;
    }

    function getUserId() {
        return localStorage.getItem('userId');
    }

});
