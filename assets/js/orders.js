document.addEventListener('DOMContentLoaded', function () {

    // ========= 顯示自己的訂單記錄 =========
    async function loadMyOrders() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('請先登入！');
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`https://api.fachost.cloud/api/orders/my-orders?user_id=${userId}`);
            const data = await response.json();

            const ordersListDiv = document.getElementById('orders-list');
            if (!ordersListDiv) {
                console.error('找不到 orders-list 的容器');
                return;
            }

            ordersListDiv.innerHTML = ''; // 清空舊資料

            if (data.orders.length === 0) {
                ordersListDiv.innerHTML = '<p>目前沒有訂單記錄。</p>';
                return;
            }

            data.orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-item');
                orderDiv.innerHTML = `
                    <h3>訂單編號：${order.id}</h3>
                    <p>套餐：${order.plan_name || '無名稱'}</p>
                    <p>金額：${order.price} 元</p>
                    <p>狀態：${order.status === 'paid' ? '已付款 ✅' : '未付款 ❌'}</p>
                    <p>建立時間：${new Date(order.created_at).toLocaleString()}</p>
                `;

                ordersListDiv.appendChild(orderDiv);
            });

        } catch (error) {
            console.error('載入訂單失敗:', error);
        }
    }

    // ========= 頁面載入時自動載入訂單 =========
    loadMyOrders();

});
