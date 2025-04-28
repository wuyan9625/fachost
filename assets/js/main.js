document.addEventListener('DOMContentLoaded', function () {

    // ========= 導覽列 =========
    const navbarHTML = `
    <nav class="navbar">
        <div class="navbar-container">
            <div class="logo">Fachost</div>
            <div class="hamburger" id="hamburger">&#9776;</div>
            <ul class="nav-links" id="nav-links">
                <li><a href="index.html" class="active">首頁</a></li>
                <li><a href="plans.html">套餐</a></li>
                <li><a href="orders.html">訂單查詢</a></li>
                <li><a href="console.html">控制台</a></li>
                <li><a href="#" id="login-btn">登入</a></li>
                <li><a href="#" id="register-btn">註冊</a></li>
            </ul>
        </div>
    </nav>
    `;
    const navbarContainer = document.createElement('div');
    navbarContainer.innerHTML = navbarHTML;
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    // ========= 響應式漢堡選單 =========
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('active');
    });

    // ========= 彈窗切換 =========
    document.addEventListener('click', (e) => {
        if (e.target.id === 'switch-to-register') {
            document.getElementById('login-form-container').classList.add('hidden');
            document.getElementById('register-form-container').classList.remove('hidden');
            document.getElementById('forgot-password-form-container').classList.add('hidden');
        }
        if (e.target.id === 'switch-to-login') {
            document.getElementById('register-form-container').classList.add('hidden');
            document.getElementById('login-form-container').classList.remove('hidden');
            document.getElementById('forgot-password-form-container').classList.add('hidden');
        }
        if (e.target.id === 'forgot-password-btn') {
            document.getElementById('login-form-container').classList.add('hidden');
            document.getElementById('register-form-container').classList.add('hidden');
            document.getElementById('forgot-password-form-container').classList.remove('hidden');
        }
    });

    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // ========= 登入提交 =========
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
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
    }

    // ========= 註冊發送驗證碼倒數 =========
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
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', async function () {
            const email = document.getElementById('register-email').value;
            if (!email) {
                alert('請先輸入 Email');
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
    }

    // ========= 註冊提交（雙重密碼驗證） =========
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const code = document.getElementById('register-code').value;

            if (password !== confirmPassword) {
                alert('兩次密碼輸入不一致');
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
    }

    // ========= 忘記密碼發送驗證碼 =========
    const sendForgotCodeBtn = document.getElementById('send-forgot-code-btn');
    if (sendForgotCodeBtn) {
        sendForgotCodeBtn.addEventListener('click', async function () {
            const email = document.getElementById('forgot-email').value;
            if (!email) {
                alert('請先輸入 Email');
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
    }

    // ========= 忘記密碼提交重設 =========
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('forgot-email').value;
            const code = document.getElementById('forgot-code').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('new-confirm-password').value;

            if (newPassword !== confirmNewPassword) {
                alert('兩次新密碼輸入不一致');
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
                alert('重設密碼失敗，請稍後再試');
            }
        });
    }

    // ========= 登出 =========
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

});
function calculateTotalWithFee(price) {
    const fixedFee = 0.3; // PayPal固定費用
    const rate = 0.029;   // PayPal百分比費用
    const total = (price + fixedFee) / (1 - rate);
    return total.toFixed(2); // 保留2位小數
}
