document.addEventListener("DOMContentLoaded", () => {
    // 基本 UI 初始化
    initNavBar(); // 初始化導航欄
    initFooter(); // 初始化頁腳
    
    // 綁定通用的事件
    bindCommonEvents(); // 綁定常規事件
});

// 初始化導航欄
function initNavBar() {
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            handleNavigation(link.href);
        });
    });
}

// 處理頁面導航邏輯
function handleNavigation(url) {
    // 可以加載對應頁面，或是做一些路由處理
    window.location.href = url;
}

// 初始化頁腳（可擴展其他功能）
function initFooter() {
    const footer = document.querySelector("footer");
    // 如果需要可以在這裡動態設置 footer 內容
}

// 綁定一些通用事件
function bindCommonEvents() {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "/login.html"; // 或顯示登入彈窗
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("jwt_token");
            window.location.href = "/"; // 重新導向到首頁
        });
    }
}
