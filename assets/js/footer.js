document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-left">
          <h3>Fachost</h3>
          <p>高性能雲主機 · 全球節點 · 安全可靠</p>
        </div>
        <div class="footer-right">
          <p>聯絡我們：</p>
          <ul>
            <li>Email: <a href="mailto:fachost.io@gmail.com">fachost.io@gmail.com</a></li>
            <li>Telegram: <a href="https://t.me/+9Cq9qirPiec4MWM1" target="_blank">fachost-Hinet</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        © 2025 Fachost 雲端服務. 保留所有權利.
      </div>
    </footer>
  `;

  document.getElementById("footer-container").innerHTML = footerHTML;
});
