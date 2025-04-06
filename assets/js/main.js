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
