document.addEventListener('DOMContentLoaded', function () {
    const footerHTML = `
    <footer class="footer">
        <div class="footer-container">
            <p>© 2025 Fachost. 保留所有權利.</p>
            <p>聯絡我們：<a href="mailto:fachost.io@gmail.com">fachost.io@gmail.com</a> | 
            Telegram：<a href="https://t.me/你的群組鏈接" target="_blank">@你的群組</a></p>
        </div>
    </footer>
    `;

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    } else {
        console.warn('找不到 footer-container，頁腳無法插入。');
    }
});
