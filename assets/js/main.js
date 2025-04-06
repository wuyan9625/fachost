// 创建套餐
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
    fetch('/api/vps/create-plan', {
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

    fetch(`/api/vps/update-plan/${planId}`, {
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
fetch('/api/vps/get-plans')  // 假设有一个获取套餐列表的 API
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
    fetch('/api/vps/create-vps', {
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
