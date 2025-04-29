document.addEventListener('DOMContentLoaded', function () {

    // ========= 动态插入 NAV 导航栏 =========
    const navbarHTML = `
    <nav class="navbar">
        <div class="navbar-container">
            <div class="logo">Fachost</div>
            <div class="hamburger" id="hamburger">&#9776;</div>
            <ul class="nav-links" id="nav-links">
                <li><a href="index.html" class="active">首页</a></li>
                <li><a href="plans.html">套餐</a></li>
                <li><a href="orders.html">订单查询</a></li>
                <li><a href="console.html">控制台</a></li>
                <li><a href="#" id="login-btn">登录</a></li>
                <li><a href="#" id="register-btn">注册</a></li>
            </ul>
        </div>
    </nav>
    `;
    const navbarContainer = document.createElement('div');
    navbarContainer.innerHTML = navbarHTML;
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    // ========= 响应式汉堡菜单 =========
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('active');
    });

    // ========= 切换登录注册 =========
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

    // ========= 登录提交 =========
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
                    alert('登录成功');
                    window.location.href = 'console.html';
                } else {
                    alert('登录失败: ' + data.message);
                }
            } catch (error) {
                alert('登录失败，请稍后再试');
            }
        });
    }

    // ========= 注册发送验证码倒计时 =========
    function startCountdown(button, seconds = 60) {
        button.disabled = true;
        button.classList.add('disabled');
        let remaining = seconds;
        button.textContent = `重新发送 (${remaining})`;

        const interval = setInterval(() => {
            remaining--;
            button.textContent = `重新发送 (${remaining})`;
            if (remaining <= 0) {
                clearInterval(interval);
                button.disabled = false;
                button.classList.remove('disabled');
                button.textContent = '发送验证码';
            }
        }, 1000);
    }

    // ========= 注册发送验证码 =========
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', async function () {
            const email = document.getElementById('register-email').value;
            if (!email) {
                alert('请先输入 Email');
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
                alert('发送验证码失败');
            }
        });
    }

    // ========= 注册提交（双重密码验证） =========
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const code = document.getElementById('register-code').value;

            if (password !== confirmPassword) {
                alert('两次密码输入不一致');
                return;
            }

            try {
                const response = await fetch('https://api.fachost.cloud/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, code })
                });
                const data = await response.json();
                if (data.message === "注册成功") {
                    alert('注册成功，请登录');
                    window.location.href = 'index.html';
                } else {
                    alert('注册失败: ' + data.message);
                }
            } catch (error) {
                alert('注册失败，请稍后再试');
            }
        });
    }

    // ========= 忘记密码发送验证码 =========
    const sendForgotCodeBtn = document.getElementById('send-forgot-code-btn');
    if (sendForgotCodeBtn) {
        sendForgotCodeBtn.addEventListener('click', async function () {
            const email = document.getElementById('forgot-email').value;
            if (!email) {
                alert('请先输入 Email');
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
                alert('发送验证码失败');
            }
        });
    }

    // ========= 忘记密码提交重设 =========
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('forgot-email').value;
            const code = document.getElementById('forgot-code').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('new-confirm-password').value;

            if (newPassword !== confirmNewPassword) {
                alert('两次新密码输入不一致');
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
                if (data.message === "密码重设成功") {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert('重设密码失败，请稍后再试');
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
