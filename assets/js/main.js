// 登录与注册功能
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    axios.post('/api/auth/login', { email, password })
        .then(function(response) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            checkUserRole();  // 权限检查
        })
        .catch(function(error) {
            alert("登录失败：" + error.message);
        });
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    axios.post('/api/auth/register', { email, password })
        .then(function(response) {
            alert("注册成功！");
            localStorage.setItem('user', JSON.stringify(response.data.user));
            checkUserRole();  // 权限检查
        })
        .catch(function(error) {
            alert("注册失败：" + error.message);
        });
});

// 检查用户角色并显示相关功能
function checkUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (user.role === 'admin') {
            document.getElementById('control-panel-btn').style.display = 'block';  // 显示管理员控制面板按钮
        }
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
    }
}

// 加载套餐信息
function loadPlans() {
    axios.get('/api/plans')
        .then(function(response) {
            const plans = response.data.plans;
            let plansHtml = '';
            plans.forEach(plan => {
                plansHtml += `
                    <div class="plan-card">
                        <h3>${plan.name}</h3>
                        <p>${plan.description}</p>
                        <p>价格: ¥${plan.price}</p>
                        <button onclick="buyPlan(${plan.id})">购买</button>
                    </div>
                `;
            });
            document.getElementById('plans-list').innerHTML = plansHtml;
        })
        .catch(function(error) {
            alert("加载套餐失败：" + error.message);
        });
}

// 购买套餐
function buyPlan(planId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("请先登录！");
        return;
    }

    axios.post('/api/orders', { userId: user.id, planId: planId })
        .then(function(response) {
            alert("套餐购买成功！");
        })
        .catch(function(error) {
            alert("购买失败：" + error.message);
        });
}

// 加载用户订单
function loadOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("请先登录！");
        return;
    }

    axios.get(`/api/orders?userId=${user.id}`)
        .then(function(response) {
            const orders = response.data.orders;
            let ordersHtml = '';
            orders.forEach(order => {
                ordersHtml += `
                    <div class="order-card">
                        <h3>订单号: ${order.id}</h3>
                        <p>套餐: ${order.plan_name}</p>
                        <p>状态: ${order.status}</p>
                        <p>购买日期: ${order.date}</p>
                    </div>
                `;
            });
            document.getElementById('orders-list').innerHTML = ordersHtml;
        })
        .catch(function(error) {
            alert("加载订单失败：" + error.message);
        });
}

// 页面加载时加载套餐和订单
if (document.getElementById('plans-list')) {
    loadPlans();
}

if (document.getElementById('orders-list')) {
    loadOrders();
}
