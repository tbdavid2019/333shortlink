# 333shortlink 安裝 / 部署方式總覽

本專案目前支援兩種正式安裝 / 部署方式：

1. **Cloudflare Workers** (推薦，高效能、低延遲，全功能支援)
2. **Cloudflare Pages** (相容備用)

兩種方式都可以正常運行短網址、Dashboard、KV、Analytics、Workers AI 等功能。

---

## 1. 選哪一種比較合適

### 選 Cloudflare Workers（推薦），如果你：

- 想直接把整個 Nuxt/Nitro server 當成 Worker (with Static Assets) 部署
- 想避免 Pages preset / `_worker.js` / build target 的差異問題
- 想用最直接、現代化的 `pnpm run deploy` 工作流

### 選 Cloudflare Pages，如果你：

- 已經習慣用 Pages 綁 GitHub 自動部署
- 想把網站和部署流程維持在 Pages 專案裡
- 希望每次 push 後自動觸發建置與上線

---

## 2. Cloudflare Workers 安裝方式（推薦）

### CLI / Wrangler 安裝

1. 建立 KV Namespace：
   ```bash
   npx wrangler kv namespace create KV
   ```
2. 將 KV namespace ID 填入私有配置 [`wrangler.local.jsonc`](../../wrangler.jsonc)
3. 設定 Worker 的 Variables / Secrets（如 `NUXT_SITE_TOKEN`）
4. 執行一鍵構建與部署：
   ```bash
   pnpm run deploy
   ```

### Workers 需要的設定

- `wrangler.jsonc` 中的 `kv_namespaces`
- `analytics_engine_datasets`
- `ai.binding`
- `compatibility_flags: ["nodejs_compat"]`

### Workers 需要的環境變數

- `NUXT_SITE_TOKEN`
- `NUXT_CF_ACCOUNT_ID`（選填，用於讀取 Analytics Engine 儀表板圖表）
- `NUXT_CF_API_TOKEN`（選填）

參考：

- [workers.md](./workers.md)
- [configuration.md](../configuration.md)

---

## 3. Cloudflare Pages 安裝方式

### 控制台安裝

1. fork 或 clone 本 repo
2. 在 Cloudflare Pages 建立專案
3. 連接 GitHub repository
4. 建置時務必使用 **Pages 專用輸出**

### 手動部署

Pages 不能直接拿 Worker 產物部署。若在本地手動 build 再 deploy，請使用：

```bash
pnpm run build:pages
pnpm run deploy:pages
```

如果沒有指定 `NITRO_PRESET=cloudflare-pages`，可能會出現：

- `dist` 內沒有 `_worker.js`
- `/api/*` 路由在 Pages 上變成 404

### Pages 需要的 Binding / 設定

- `KV` -> Cloudflare KV Namespace
- `ANALYTICS` -> Analytics Engine dataset
- `AI` -> Workers AI（可選）
- Compatibility flag: `nodejs_compat`

參考：

- [pages.md](./pages.md)
- [configuration.md](../configuration.md)

---

## 4. 推薦操作指令

### 本地開發

```bash
pnpm install
cp .env.example .env
pnpm dev
```

### 部署到 Workers

```bash
pnpm run deploy
# 或部署指定站台
pnpm run deploy <site-name>
# 或連鎖部署所有站台
pnpm run deploy all
```

### 部署到 Pages

```bash
pnpm run deploy:pages
```
