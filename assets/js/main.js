// 处理创建套餐表单
document.getElementById('create-plan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const planData = {
        name: document.getElementById('plan-name').value,
        description: document.getElementById('plan-description').value,
        price: parseFloat(document.getElementById('plan-price').value),
        duration: document.getElementById('plan-duration').value, // 'monthly', 'quarterly', 'yearly'
        total_vps: parseInt(document.getElementById('plan-total-vps').value)
    };

    // 发送请求到后端创建套餐
    fetch('https://api.fachost.cloud/api/vps/create-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Error:', error));
});

// 更新套餐
document.getElementById('update-plan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const planData = {
        price: parseFloat(document.getElementById('new-price').value),
        total_vps: parseInt(document.getElementById('new-total-vps').value)
    };

    const planId = document.getElementById('plan-id').value;

    fetch(`https://api.fachost.cloud/api/vps/update-plan/${planId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Error:', error));
});

// 获取套餐列表并显示
fetch('https://api.fachost.cloud/api/vps/get-plans')  // 假设有一个获取套餐列表的 API
    .then(response => response.json())
    .then(data => {
        const planListDiv = document.getElementById('plan-list');
        data.plans.forEach(plan => {
            const planDiv = document.createElement('div');
            planDiv.classList.add('plan-item');
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
    })
    .catch(error => console.error("Error:", error));

// 购买 VPS
function purchaseVps(planId) {
    const userId = getUserId();  // 假设有一个函数来获取当前用户 ID

    const data = {
        user_id: userId,
        plan_id: planId
    };

    // 向后端发送购买请求
    fetch('https://api.fachost.cloud/api/vps/create-vps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "VPS 创建成功") {
            alert("购买成功！");
            // 更新前端页面上的库存
            updatePlanStock(planId);
        } else {
            alert("购买失败：" + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

// 更新套餐库存
function updatePlanStock(planId) {
    const planDiv = document.querySelector(`.plan-item[data-plan-id="${planId}"]`);
    const availableVps = planDiv.querySelector('.available-vps');
    availableVps.textContent = parseInt(availableVps.textContent) - 1;
}

// 从本地存储或其他地方获取当前用户 ID
function getUserId() {
    return localStorage.getItem('userId'); // 假设从 localStorage 获取用户 ID
}

// 登录与注册模态框切换
document.getElementById('switch-to-register').addEventListener('click', function() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
});

document.getElementById('switch-to-login').addEventListener('click', function() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});

// 登录表单提交
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // 发送登录请求
    fetch('https://api.fachost.cloud/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('userId', data.userId);  // 假设后端返回了用户 ID
            alert('登录成功');
            window.location.href = 'console.html';  // 跳转到控制台页面
        } else {
            alert('登录失败: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// 注册表单提交
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // 发送注册请求
    fetch('https://api.fachost.cloud/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('注册成功');
            window.location.href = 'index.html';  // 注册成功后返回首页
        } else {
            alert('注册失败: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// 退出登录
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('userId');  // 删除用户 ID
    window.location.href = 'index.html';  // 跳转到首页
});
