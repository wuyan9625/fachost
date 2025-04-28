# Fachost 前端網站

Fachost 是一個 VPS 自動開通 + 控制平台，前端採用 HTML / CSS / JS 打造，搭配後端 API 提供完整自助購買與控制功能。

本專案為前端部分（靜態頁面 + API 串接）。

---

## 目錄結構

fachost-frontend/ ├── index.html # 首頁（登入、註冊入口） ├── plans.html # 套餐購買頁 ├── orders.html # 訂單查詢頁 ├── console.html # 使用者控制台（小雞操作） ├── admin.html # 管理員後台（套餐管理） ├── assets/ │ ├── css/ │ │ └── style.css # 全站統一版CSS │ └── js/ │ └── auth.js # 全站共用JS（登入註冊、購買、撥號） └── README.md # 使用說明（本文件）

---

## 部署方式

1. 將整個 `fachost-frontend` 資料夾上傳至伺服器或 GitHub Pages。
2. 確保所有 API 請求路徑指向：
https://api.fachost.cloud/api/

（前端與後端分離，後端用 Nginx 反向代理 Flask Gunicorn）

3. 若使用 GitHub Pages：
- 直接推送至公開倉庫。
- 在 `Settings > Pages` 設定部署分支。

---

## 功能說明

| 頁面            | 功能簡述 |
| :-------------- | :-- |
| index.html      | 登入、註冊、忘記密碼、響應式導航 |
| plans.html      | 套餐清單展示，支援購買套餐、扣除庫存 |
| orders.html     | 顯示登入使用者訂單紀錄 |
| console.html    | 控制屬於自己的 VPS（小雞），支援手動撥號 / 刷新 IP |
| admin.html      | 管理員登入後可建立、修改套餐 |

---

## API 接口總覽

| 介面            | 方法 | 位置                  | 說明 |
| :-------------- | :--- | :--------------------- | :--- |
| `/auth/login`     | POST | 登入帳號 |
| `/auth/register`  | POST | 註冊新帳號（需驗證碼） |
| `/auth/send-verification` | POST | 發送驗證碼 |
| `/auth/reset-password` | POST | 忘記密碼重設 |
| `/vps/get-plans`  | GET  | 取得所有可購買套餐 |
| `/vps/create-vps` | POST | 購買套餐並自動開通 VPS |
| `/vps/select-vps` | POST | 使用者刷新 IP (撥號) |
| `/vps/create-plan` | POST | （管理員）新增套餐 |
| `/vps/update-plan/:id` | PUT | （管理員）更新套餐 |

---

## 注意事項

- 必須搭配已正確部署的 Fachost 後端 (Flask + Gunicorn + Nginx)。
- 前端為純靜態頁面，無需 Node.js 或任何編譯工具。
- 響應式設計，支援手機、平板、桌機瀏覽。
- 密碼加密、登入 token、權限驗證均由後端負責，前端只負責資料傳輸與展示。

---

## 環境要求

- 任意支援 HTTPS 的靜態網頁主機（如 GitHub Pages、VPS + Nginx）
- 後端 API：必須能提供 SSL (HTTPS)。
- 推薦搭配 Cloudflare 代理，提高安全性與性能。

---

✅ 完整版 Fachost 前端網站說明  
✅ 目錄清楚、部署簡單、未來擴展容易！

