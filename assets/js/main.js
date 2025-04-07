document.addEventListener('DOMContentLoaded', function () {

    // 顯示註冊表單
    document.getElementById('switch-to-register').addEventListener('click', function() {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    });

    // 顯示登錄表單
    document.getElementById('switch-to-login').addEventListener('click', function() {
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
    });

    // 登錄按鈕點擊事件
    document.getElementById('login-btn').addEventListener('click', function() {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
    });

    // 註冊按鈕點擊事件
    document.getElementById('register-btn').addEventListener('click', function() {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
        document.getElementById('login-form-container').classList.add('hidden');
    });

    // 關閉模態窗口
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // 登錄表單提交
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://api.fachost.cloud/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('userId', data.userId);
                alert('登录成功');
                window.location.href = 'console.html';  // 跳转到控制台页面
            } else {
                alert('登录失败: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 註冊表單提交
    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('https://api.fachost.cloud/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                alert('注册成功');
                window.location.href = 'index.html';  // 注册成功后返回首页
            } else {
                alert('注册失败: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('userId');
        window.location.href = 'index.html';  // 跳转到首页
    });

    // 创建套餐表单提交
    document.getElementById('create-plan-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const planData = {
            name: document.getElementById('plan-name').value,
            description: document.getElementById('plan-description').value,
            price: parseFloat(document.getElementById('plan-price').value),
            duration: document.getElementById('plan-duration').value,
            total_vps: parseInt(document.getElementById('plan-total-vps').value)
        };

        try {
            const response = await fetch('https://api.fachost.cloud/vps/create-plan', {
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
    document.getElementById('update-plan-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const planData = {
            price: parseFloat(document.getElementById('new-price').value),
            total_vps: parseInt(document.getElementById('new-total-vps').value)
        };

        const planId = document.getElementById('plan-id').value;

        try {
            const response = await fetch(`https://api.fachost.cloud/vps/update-plan/${planId}`, {
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

    // 获取套餐列表并显示
    async function fetchPlans() {
        try {
            const response = await fetch('https://api.fachost.cloud/vps/get-plans');
            const data = await response.json();
            const planListDiv = document.getElementById('plan-list');
            data.plans.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-item');
                planDiv.setAttribute('data-plan-id', plan.id);
                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>描述：${plan.description}</p>
                    <p>价格：${plan.price}</p>
                    <p>总量：${plan.total_vps}</p>
                    <p>可用：${plan.available_vps}</p>
                    <button onclick="purchaseVps(${plan.id})">购买</button>
                `;
                planListDiv.appendChild(planDiv);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    fetchPlans();

    // 购买 VPS
    window.purchaseVps = async function(planId) {
        const userId = getUserId();

        const data = {
            user_id: userId,
            plan_id: planId
        };

        try {
            const response = await fetch('https://api.fachost.cloud/vps/create-vps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.message === "VPS 创建成功") {
                alert("购买成功！");
                updatePlanStock(planId);
            } else {
                alert("购买失败：" + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 更新套餐库存
    function updatePlanStock(planId) {
        const planDiv = document.querySelector(`.plan-item[data-plan-id="${planId}"]`);
        const availableVps = planDiv.querySelector('.available-vps');
        availableVps.textContent = parseInt(availableVps.textContent) - 1;
    }

    // 从本地存储获取当前用户 ID
    function getUserId() {
        return localStorage.getItem('userId');
    }

});
