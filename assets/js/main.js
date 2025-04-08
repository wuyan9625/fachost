document.addEventListener('DOMContentLoaded', function () {

    // ========= 切換登入註冊 =========
    document.getElementById('switch-to-register').addEventListener('click', () => {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    });

    document.getElementById('switch-to-login').addEventListener('click', () => {
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
    });

    document.getElementById('login-btn').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
    });

    document.getElementById('register-btn').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
        document.getElementById('login-form-container').classList.add('hidden');
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // ========= 登入提交 =========
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            alert('登入失敗，請稍後再試');
        }
    });

    // ========= 註冊驗證碼倒數鎖定 =========
    function startCountdown(button, seconds = 60) {
        button.disabled = true;
        button.classList.add('disabled');
        let remaining = seconds;
        button.textContent = `重新發送 (${remaining})`;

        const interval = setInterval(() => {
            remaining--;
            button.textContent = `重新發送 (${remaining})`;
            if (remaining <= 0) {
                clearInterval(interval);
                button.disabled = false;
                button.classList.remove('disabled');
                button.textContent = '發送驗證碼';
            }
        }, 1000);
    }

    // ========= 發送註冊驗證碼 =========
    document.getElementById('send-code-btn').addEventListener('click', async function () {
        const email = document.getElementById('register-email').value;
        const button = this;

        if (!email) {
            alert('請先輸入 Email');
            return;
        }

        try {
            const response = await fetch('/api/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            alert(data.message);
            startCountdown(button); // ✅ 倒數鎖定按鈕
        } catch (error) {
            alert('發送驗證碼失敗');
        }
    });

    // ========= 註冊提交 =========
    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const code = document.getElementById('register-code').value;

        try {
            const response = await fetch('/api/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            alert('註冊失敗，請稍後再試');
        }
    });

    // ========= 登出 =========
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    // ========= 創建套餐 =========
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
                const response = await fetch('/api/api/vps/create-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planData)
                });
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                alert('創建套餐失敗');
            }
        });
    }

    // ========= 更新套餐 =========
    const updateForm = document.getElementById('update-plan-form');
    if (updateForm) {
        updateForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const planData = {
                price: parseFloat(document.getElementById('new-price').value),
                total_vps: parseInt(document.getElementById('new-total-vps').value)
            };

            const planId = document.getElementById('plan-id').value;

            try {
                const response = await fetch(`/api/api/vps/update-plan/${planId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planData)
                });
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                alert('更新套餐失敗');
            }
        });
    }

    // ========= 顯示所有套餐 =========
    async function fetchPlans() {
        try {
            const response = await fetch('/api/api/vps/get-plans');
            const data = await response.json();
            const planListDiv = document.getElementById('plan-list');
            if (!planListDiv) return;

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
            console.error("獲取套餐失敗：", error);
        }
    }

    fetchPlans();

    // ========= 購買 VPS =========
    window.purchaseVps = async function (planId) {
        const userId = getUserId();

        const data = {
            user_id: userId,
            plan_id: planId
        };

        try {
            const response = await fetch('/api/api/vps/create-vps', {
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
            alert("錯誤：" + error.message);
        }
    };

    // ========= 更新前端庫存數 =========
    function updatePlanStock(planId) {
        const planDiv = document.querySelector(`.plan-item[data-plan-id="${planId}"]`);
        const availableVps = planDiv.querySelector('.available-vps');
        availableVps.textContent = parseInt(availableVps.textContent) - 1;
    }

    function getUserId() {
        return localStorage.getItem('userId');
    }

});
