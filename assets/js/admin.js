document.addEventListener('DOMContentLoaded', function () {
    const createForm = document.getElementById('create-plan-form');
    const updateForm = document.getElementById('update-plan-form');
    const planListDiv = document.getElementById('plan-list');

    // ========== 創建套餐 ==========
    if (createForm) {
        createForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const createBtn = createForm.querySelector('button[type="submit"]');
            createBtn.disabled = true;
            createBtn.textContent = '提交中...';

            const planData = {
                name: document.getElementById('plan-name').value,
                description: document.getElementById('plan-description').value,
                price: parseFloat(document.getElementById('plan-price').value),
                duration: document.getElementById('plan-duration').value,
                total_vps: parseInt(document.getElementById('plan-total-vps').value)
            };

            try {
                const response = await fetch('https://api.fachost.cloud/api/vps/create-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planData)
                });
                const data = await response.json();
                alert(data.message);
                await refreshPlans();
                createForm.reset();
            } catch (error) {
                alert('提交失敗：' + (error.message || '未知錯誤'));
            } finally {
                createBtn.disabled = false;
                createBtn.textContent = '提交';
            }
        });
    }

    // ========== 更新套餐 ==========
    if (updateForm) {
        updateForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const updateBtn = updateForm.querySelector('button[type="submit"]');
            updateBtn.disabled = true;
            updateBtn.textContent = '更新中...';

            const planId = document.getElementById('plan-id').value;
            const updateData = {
                price: parseFloat(document.getElementById('new-price').value),
                total_vps: parseInt(document.getElementById('new-total-vps').value)
            };

            try {
                const response = await fetch(`https://api.fachost.cloud/api/vps/update-plan/${planId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                const data = await response.json();
                alert(data.message);
                await refreshPlans();
            } catch (error) {
                alert('更新失敗：' + (error.message || '未知錯誤'));
            } finally {
                updateBtn.disabled = false;
                updateBtn.textContent = '更新';
            }
        });
    }

    // ========== 刷新套餐列表 ==========
    async function refreshPlans() {
        if (!planListDiv) return;
        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/get-plans');
            const data = await response.json();
            planListDiv.innerHTML = '';

            data.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-item');
                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>描述：${plan.description}</p>
                    <p>價格：${plan.price}</p>
                    <p>總量：${plan.total_vps}</p>
                    <p>可用：${plan.available_vps}</p>
                    <button onclick="deletePlan(${plan.id})">刪除</button>
                `;
                planListDiv.appendChild(planDiv);
            });
        } catch (error) {
            console.error('刷新套餐列表失敗', error);
        }
    }

    // ========== 刪除套餐 ==========
    window.deletePlan = async function (planId) {
        if (!confirm('確定要刪除這個套餐嗎？')) return;
        try {
            const response = await fetch(`https://api.fachost.cloud/api/vps/delete-plan/${planId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message);
            await refreshPlans();
        } catch (error) {
            alert('刪除失敗：' + (error.message || '未知錯誤'));
        }
    };

    // 初始載入一次
    refreshPlans();
});
