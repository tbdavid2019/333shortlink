<div align="center">

# ⚡ 333shortlink

**基于 Cloudflare Workers、KV 与 Nuxt 4 构建的现代化、极速且安全的企业级 Serverless 短链接服务。**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest)](https://vitest.dev/)

[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

</div>

---

## ✨ 核心特性

- ⚡ **100% Serverless 架构**：完全运行于 Cloudflare Workers（带 Static Assets）、KV 与 Analytics Engine。零服务器维护成本、零冷启动延迟、全球边缘极速响应。
- 🌐 **全站动态多域名品牌化**：系统自动根据当前访问域名动态调整后台品牌名称与面包屑，无需重复修改源码。
- 🪪 **生物识别 Passkey (WebAuthn)**：支持 Touch ID、Face ID、Windows Hello 及安全密钥免密登录，具备单次消费防重放机制。
- 🤖 **WebMCP 与 MCP 协议原生支持**：内置 Model Context Protocol (MCP) 与 Cloudflare WebMCP，支持 Chrome 146+ 浏览器端 AI Agent 及 Claude Desktop / Cursor 结构化调用。
- 🔁 **随机短链接去重复用**：缩短相同目标网址时自动复用已有短链接，自定义后缀保持独立。
- 🧠 **AI 智能后缀生成**：集成 Cloudflare Workers AI，根据长网址智能推荐语义化、易记的短链接后缀。
- 🧭 **中转跳转页 (Transition Page) 与追踪集成**：支持自定义过渡倒计时跳转页面，原生集成 GA4、Meta Pixel 与 LINE LIFF 登录验证追踪。
- 📊 **实时数据分析仪表盘**：内置 3D 地球仪与多维度访客指标（来源网站、访问设备、地理分布与点击次数）。

---

## 🧱 技术栈

| 层级         | 选用技术                                                                                                         |
| :----------- | :--------------------------------------------------------------------------------------------------------------- |
| **全栈框架** | [Nuxt 4](https://nuxt.com/) (Vue 3, Vite, Tailwind CSS, shadcn-vue)                                              |
| **边缘计算** | [Cloudflare Workers with Static Assets](https://developers.cloudflare.com/workers/)                              |
| **键值存储** | [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)                                                   |
| **指标分析** | [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/)                              |
| **AI 协议**  | [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) & [WebMCP](https://blog.cloudflare.com/webmcp/) |

---

## 🚀 快速上手 (Quickstart)

### 系统要求

- **Node.js**: `>= 22.18` (Cloudflare 官方推荐版本)
- **包管理器**: `pnpm` (`>= 10`)
- **Cloudflare 账号** (免费计划即可完整运行)

### 1. 克隆项目与安装依赖

```bash
git clone https://github.com/tbdavid2019/333shortlink.git
cd 333shortlink
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

在 `.env` 中设置您的管理密钥：

```env
NUXT_SITE_TOKEN=your-secure-site-token
```

### 3. 本地开发

```bash
pnpm dev
```

打开浏览器访问 `http://localhost:3000`。Wrangler 会在本地自动模拟 KV 与 AI 运行环境，无需联网即可进行完整功能开发。

### 4. 部署至 Cloudflare Workers

1. 登录 Cloudflare CLI：
   ```bash
   cf auth login
   # 或
   npx wrangler login
   ```
2. 创建云端 KV 数据库命名空间：
   ```bash
   npx wrangler kv namespace create KV
   ```
3. 创建本地私有配置文件并填入 KV ID（该文件受 `.gitignore` 保护，防止 ID 泄露）：
   ```bash
   cp wrangler.local.example.jsonc wrangler.local.jsonc
   ```
4. 一键构建与部署：
   ```bash
   pnpm run deploy
   ```

---

## 📚 模块化文档 (Documentation)

为保持主页文档精简易读，深度技术指南已归档至 [`docs/`](docs/) 目录：

- 🚀 **[Workers 部署指南 (Deployment Guide)](docs/deployment/workers.md)**：完整生产部署与多租户账号独立发布说明。
- 🤖 **[WebMCP 与 MCP 协议指南 (MCP Guide)](docs/mcp.md)**：Claude Desktop、Cursor 与 Chrome 146+ AI Agent 工具配置。
- 🧭 **[Transition Page 与追踪集成指南](docs/transition-page.md)**：中转页模式切换、GA4、Meta Pixel 与 LINE LIFF 追踪设置。
- 🔐 **[安全性与 Passkey 认证指南](docs/security.md)**：生物识别注册、HMAC 签名 Challenge 与单次消费防重放保护。
- 📡 **[REST API 接口规范 (API Reference)](docs/api.md)**：完整 HTTP API 端点与数据结构说明。
- ⚙️ **[环境变量配置指南 (Configuration)](docs/configuration.md)**：运行时环境变量与默认值说明。

---

## 🏢 多站点 / 多租户独立部署

无需修改任何代码，即可将同一套源码部署至多个独立 Cloudflare 账号或域名：

```bash
# 单独部署指定站点（自动读取 wrangler.<site>.local.jsonc）
pnpm run deploy siteA

# 一键按序连锁部署所有已配置的本地站点
pnpm run deploy all
```

---

## 🧪 代码质量与测试

```bash
# 执行 ESLint 代码检查
pnpm lint

# 执行全套 56 项 Vitest 单元测试（跳转、KV、Passkeys、WebMCP）
pnpm test
```

---

## 💖 致谢

本项目最初基于 [miantiao-me/Sink](https://github.com/miantiao-me/Sink) 演进开发，感谢原作者与开源社区的贡献！

---

## 📄 开源许可证 (License)

本项目基于 [MIT License](LICENSE) 许可证开源。
