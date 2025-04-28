document.addEventListener('DOMContentLoaded', function () {

    // ========= 計算價格（加上手續費） =========
    function calculateTotalWithFee(price) {
        const fixedFee = 0.3;  // PayPal固定費用
        const rate = 0.029;    // 百分比手續費
        const total = (price + fixedFee) / (1 - rate);
        return total.toFixed(2); // 保留2位小數
    }

    // ========= 顯示所有套餐 =========
    async function fetchPlans() {
        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/get-plans');
            const data = await response.json();
            const planListDiv = document.getElementById('plan-list');
            if (!planListDiv) {
                console.error("找不到 plan-list 的區域");
                return;
            }

            planListDiv.innerHTML = ''; // 清空舊的

            data.plans.forEach(plan => {
                const finalPrice = calculateTotalWithFee(plan.price);

                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-item');
                planDiv.setAttribute('data-plan-id', plan.id);

                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>描述：${plan.description || '無描述'}</p>
                    <p>原價：${plan.price} 元</p>
                    <p>含手續費後：<strong>${finalPrice} 元</strong></p>
                    <p>可用數量：${plan.available_vps}/${plan.total_vps}</p>
                    <button onclick="purchaseVps(${plan.id}, ${finalPrice})">立即購買</button>
                `;

                planListDiv.appendChild(planDiv);
            });

        } catch (error) {
            console.error('載入套餐失敗:', error);
        }
    }

    // ========= 購買 VPS 套餐 =========
    window.purchaseVps = async function (planId, finalPrice) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('請先登入！');
            return;
        }

        const data = {
            user_id: userId,
            plan_id: planId,
            price: finalPrice
        };

        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/create-vps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.message === "VPS 创建成功") {
                alert('購買成功，請到控制台查看！');
                window.location.href = 'console.html';  // 購買成功後跳控制台
            } else {
                alert('購買失敗: ' + result.message);
            }
        } catch (error) {
            alert('購買過程出錯');
        }
    };

    // ========= 頁面載入時自動拉套餐 =========
    fetchPlans();

});
