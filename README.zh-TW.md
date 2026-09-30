<div align="center">

# ⚡ 333shortlink

**基於 Cloudflare Workers、KV 與 Nuxt 4 構建的現代化、極速且安全的開源 Serverless 短網址服務。**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest)](https://vitest.dev/)

[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

</div>

---

## ✨ 核心特色

- ⚡ **100% Serverless 架構**：全數運行於 Cloudflare Workers（搭配 Static Assets）、KV 與 Analytics Engine。零伺服器維護負擔、零冷啟動延遲、全球邊緣極速響應。
- 🌐 **全站動態多網域品牌化**：系統自動根據造訪網域即時變更後台抬頭與麵包屑，無須為多網域重複修改原始碼。
- 🪪 **生物識別 Passkey (WebAuthn)**：支援 Touch ID、Face ID、Windows Hello 與安全金鑰免密登入，具備單次消費防重放機制。
- 🤖 **WebMCP & MCP 協議原生支援**：內建 Model Context Protocol (MCP) 與 Google Chrome WebMCP，支援 Chrome 146+ 瀏覽器端 AI Agent（包含 `consequentialHint` 安全標記與 `signal` 取消控制）及 Claude Desktop / Cursor 呼叫。
- 📄 **LLMs.txt 規格標準支援**：原生提供 [`/llms.txt`](public/llms.txt) 與 [`/llms-full.txt`](public/llms-full.txt)，遵循 [llmstxt.org](https://llmstxt.org/) 規格，供 AI 模型與 Agent 秒級讀取全站架構與工具定義。
- 🔁 **隨機短網址重複使用機制**：縮短相同目標網址時自動重複使用既有隨機短網址，自訂後綴則保持獨立。
- 🧠 **AI 智慧後綴生成**：整合 Workers AI，根據長網址自動推薦易記且富含語意的短網址後綴。
- 🧭 **中轉跳轉頁 (Transition Page) 與追蹤整合**：可自訂過渡倒數跳轉頁面，原生支援 GA4、Meta Pixel 與 LINE LIFF 登入驗證追蹤。
- 🌍 **動態多語系 SEO 與介面切換**：伺服端 SSR 依造訪者 `Accept-Language` 動態注入對應語系之 Title 與 Meta Description，並提供直觀的 En | 繁體 介面語系切換器與 Cookie 偏好記憶。
- 📊 **即時數據分析儀表板**：內建 3D 地球儀與全方位訪客指標（來源網站、設備、地理分佈與點擊次數）。

---

## 🧱 技術棧

| 項目           | 技術選型                                                                                                                                                              |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **全端框架**   | [Nuxt 4](https://nuxt.com/) (Vue 3, Vite, Tailwind CSS, shadcn-vue)                                                                                                   |
| **邊緣運算**   | [Cloudflare Workers with Static Assets](https://developers.cloudflare.com/workers/)                                                                                   |
| **鍵值資料庫** | [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)                                                                                                        |
| **指標與分析** | [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/)                                                                                   |
| **AI 協議**    | [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)、[Chrome WebMCP](https://developer.chrome.com/docs/ai/webmcp) 與 [llmstxt.org](https://llmstxt.org/) |

---

## 🚀 快速開始 (Quickstart)

### 系統需求

- **Node.js**: `>= 22.18` (Cloudflare 官方推薦版本)
- **套件管理器**: `pnpm` (`>= 10`)
- **Cloudflare 帳號** (免費方案即可完整運行)

### 1. 複製專案與安裝依賴

```bash
git clone https://github.com/tbdavid2019/333shortlink.git
cd 333shortlink
pnpm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
```

在 `.env` 中設定您的管理金鑰：

```env
NUXT_SITE_TOKEN=your-secure-site-token
```

### 3. 本地開發

```bash
pnpm dev
```

開啟瀏覽器造訪 `http://localhost:3000`。Wrangler 會在本地自動模擬 KV 與 AI 執行環境，完全無須連線至線上 Cloudflare。

### 4. 部署至 Cloudflare Workers

1. 登入 Cloudflare CLI：
   ```bash
   cf auth login
   # 或
   npx wrangler login
   ```
2. 建立雲端 KV 資料庫命名空間：
   ```bash
   npx wrangler kv namespace create KV
   ```
3. 建立本地安全設定檔並填入 KV ID（該檔案已受 `.gitignore` 保護，防止 ID 洩漏）：
   ```bash
   cp wrangler.local.example.jsonc wrangler.local.jsonc
   ```
4. 一鍵構建與部署：
   ```bash
   pnpm run deploy
   ```

---

## 📚 模組化技術文件 (Documentation)

為保持專案首頁簡潔清晰，深入技術文件已拆分至 [`docs/`](docs/) 目錄：

- 🚀 **[Workers 部署指南 (Deployment Guide)](docs/deployment/workers.md)**：詳細生產部署步驟與多租戶帳號獨立發布手冊。
- 🤖 **[WebMCP 與 MCP 協議手冊 (MCP Guide)](docs/mcp.md)**：Claude Desktop、Cursor 與 Chrome 146+ AI Agent 工具配置。
- 📄 **[LLMs.txt 規格文件](public/llms.txt)**：遵循 [llmstxt.org](https://llmstxt.org/) 規格的機器可讀架構與工具總覽。
- 🧭 **[Transition Page 與追蹤整合手冊](docs/transition-page.md)**：中轉頁模式切換、GA4、Meta Pixel 與 LINE LIFF 追蹤設定。
- 🔐 **[安全性與 Passkey 認證指南](docs/security.md)**：生物識別註冊、HMAC 簽章 Challenge 與單次消費防重放保護。
- 📡 **[REST API 接口規格 (API Reference)](docs/api.md)**：完整 HTTP API 端點與資料格式說明。
- ⚙️ **[環境變數設定指南 (Configuration)](docs/configuration.md)**：完整執行期環境變數與預設值說明。

---

## 🏢 多站台 / 多帳號獨立部署

無需修改任何程式碼，即可將同一套原始碼部署至多個不同 Cloudflare 帳號或網域：

```bash
# 單獨部署指定站台（自動讀取 wrangler.<site>.local.jsonc）
pnpm run deploy siteA

# 一鍵批次連鎖部署所有已設定的本地站台
pnpm run deploy all
```

---

## 🧪 代碼品質與測試

```bash
# 執行 ESLint 程式碼檢查
pnpm lint

# 執行全套 56 項 Vitest 單元測試（跳轉、KV、Passkeys、WebMCP）
pnpm test
```

---

## 💖 致謝

本專案最初基於 [miantiao-me/Sink](https://github.com/miantiao-me/Sink) 演進開發，感謝原作者與開源社群的貢獻！

---

## 📄 授權條款 (License)

本專案採用 [GNU Affero 通用公共授權條款第三版 (AGPL-3.0)](LICENSE) 開源授權。
