document.addEventListener('DOMContentLoaded', function () {
    // ======= 建立套餐 =======
    const createForm = document.getElementById('create-plan-form');
    if (createForm) {
        createForm.addEventListener('submit', async function (event) {
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
                alert('❌ 套餐建立失敗');
            }
        });
    }

    // ======= 更新套餐 =======
    const updateForm = document.getElementById('update-plan-form');
    if (updateForm) {
        updateForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const planId = document.getElementById('plan-id').value;
            const updateData = {
                price: parseFloat(document.getElementById('new-price').value),
                total_vps: parseInt(document.getElementById('new-total-vps').value)
            };

            try {
                const response = await fetch(`https://api.fachost.cloud/api/api/vps/update-plan/${planId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                alert('❌ 套餐更新失敗');
            }
        });
    }
});
