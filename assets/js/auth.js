document.addEventListener('DOMContentLoaded', function () {

    // ========= 動態插入導覽列 =========
    const navbarHTML = `
    <nav class="navbar">
        <div class="navbar-container">
            <div class="logo">Fachost</div>
            <div class="hamburger" id="hamburger">&#9776;</div>
            <ul class="nav-links" id="nav-links">
                <li><a href="index.html">首頁</a></li>
                <li><a href="plans.html">套餐</a></li>
                <li><a href="orders.html">訂單查詢</a></li>
                <li><a href="console.html">控制台</a></li>
                <li><a href="#" id="login-btn">登入</a></li>
                <li><a href="#" id="register-btn">註冊</a></li>
                <li><a href="#" id="logout-btn" class="hidden">登出</a></li>
            </ul>
        </div>
    </nav>`;
    const navbarContainer = document.createElement('div');
    navbarContainer.innerHTML = navbarHTML;
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    // ========= 響應式漢堡選單 =========
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('active');
    });

    // ========= 檢查登入狀態 =========
    if (localStorage.getItem('token')) {
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('register-btn').classList.add('hidden');
        document.getElementById('logout-btn').classList.remove('hidden');
    }

    // ========= 登出功能 =========
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    // ========= 彈窗切換（登入/註冊/忘記密碼） =========
    document.addEventListener('click', (e) => {
        if (e.target.id === 'login-btn') {
            openModal('login');
        }
        if (e.target.id === 'register-btn') {
            openModal('register');
        }
        if (e.target.id === 'forgot-password-btn') {
            openModal('forgot');
        }
        if (e.target.id === 'switch-to-register') {
            openModal('register');
        }
        if (e.target.id === 'switch-to-login') {
            openModal('login');
        }
    });

    function openModal(mode) {
        document.getElementById('auth-modal')?.classList.remove('hidden');
        document.getElementById('login-form-container')?.classList.add('hidden');
        document.getElementById('register-form-container')?.classList.add('hidden');
        document.getElementById('forgot-password-form-container')?.classList.add('hidden');

        if (mode === 'login') document.getElementById('login-form-container')?.classList.remove('hidden');
        if (mode === 'register') document.getElementById('register-form-container')?.classList.remove('hidden');
        if (mode === 'forgot') document.getElementById('forgot-password-form-container')?.classList.remove('hidden');
    }

    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // ========= 登入功能 =========
    document.getElementById('login-form')?.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://api.fachost.cloud/api/auth/login', {
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

    // ========= 註冊發送驗證碼倒數功能 =========
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

    // ========= 註冊發送驗證碼 =========
    document.getElementById('send-code-btn')?.addEventListener('click', async function () {
        const email = document.getElementById('register-email').value;
        if (!email) {
            alert('請先輸入Email');
            return;
        }

        try {
            const response = await fetch('https://api.fachost.cloud/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            alert(data.message);
            startCountdown(this);
        } catch (error) {
            alert('發送驗證碼失敗');
        }
    });

    // ========= 註冊提交（雙重密碼確認） =========
    document.getElementById('register-form')?.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const code = document.getElementById('register-code').value;

        if (password !== confirmPassword) {
            alert('兩次密碼不一致');
            return;
        }

        try {
            const response = await fetch('https://api.fachost.cloud/api/auth/register', {
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

    // ========= 忘記密碼發送驗證碼 =========
    document.getElementById('send-forgot-code-btn')?.addEventListener('click', async function () {
        const email = document.getElementById('forgot-email').value;
        if (!email) {
            alert('請先輸入Email');
            return;
        }

        try {
            const response = await fetch('https://api.fachost.cloud/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            alert(data.message);
            startCountdown(this);
        } catch (error) {
            alert('發送驗證碼失敗');
        }
    });

    // ========= 忘記密碼提交重設 =========
    document.getElementById('forgot-password-form')?.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const code = document.getElementById('forgot-code').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('new-confirm-password').value;

        if (newPassword !== confirmNewPassword) {
            alert('兩次新密碼不一致');
            return;
        }

        try {
            const response = await fetch('https://api.fachost.cloud/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, new_password: newPassword })
            });
            const data = await response.json();
            alert(data.message);
            if (data.message === "密碼重設成功") {
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert('重設密碼失敗');
        }
    });

    // ========= 顯示所有套餐（plans.html用） =========
    async function fetchPlans() {
        const planListDiv = document.getElementById('plan-list');
        if (!planListDiv) return; // 如果不是plans頁，跳過

        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/get-plans');
            const data = await response.json();
            planListDiv.innerHTML = '';

            data.plans.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-item');
                planDiv.setAttribute('data-plan-id', plan.id);
                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    <p>描述：${plan.description}</p>
                    <p>價格：${plan.price} 元</p>
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

    // ========= 購買VPS =========
    window.purchaseVps = async function (planId) {
        const userId = getUserId();
        if (!userId) {
            alert('請先登入再購買');
            return;
        }

        const data = { user_id: userId, plan_id: planId };

        try {
            const response = await fetch('https://api.fachost.cloud/api/vps/create-vps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.message === "VPS 创建成功") {
                alert('購買成功');
                updatePlanStock(planId);
            } else {
                alert('購買失敗: ' + result.message);
            }
        } catch (error) {
            alert('錯誤：' + error.message);
        }
    };

    function updatePlanStock(planId) {
        const planDiv = document.querySelector(`.plan-item[data-plan-id="${planId}"]`);
        const availableVps = planDiv.querySelector('.available-vps');
        availableVps.textContent = parseInt(availableVps.textContent) - 1;
    }

    function getUserId() {
        return localStorage.getItem('userId');
    }

});
