# CLAUDE.md — cryptoucan.xyz

## 项目概述

**cryptoucan.xyz** 是一个免费、无需注册的以太坊钱包分析工具，将链上数据转化为可读的普通语言。部署在 Cloudflare Pages + Workers 上，是一个纯静态网站 + Serverless 函数架构。

## 技术栈

- **前端**: 纯 HTML + 内联 CSS + 原生 JavaScript（无框架、无构建步骤）
- **后端**: Cloudflare Workers（`/functions` 目录）
- **部署**: Cloudflare Pages（git push 即部署）
- **外部 API**:
  - Etherscan API（钱包数据、交易记录）
  - CoinGecko（ETH 实时价格）
  - Google Analytics（GA ID: `G-3ZNW6K2XX4`）

## 项目结构

```
cryptoucan.xyz/
├── index.html              # 首页（搜索框、功能介绍、博客预览、FAQ）
├── address.html            # 核心：钱包分析工具页
├── blog.html               # 博客列表页
├── sw.js                   # Service Worker（PWA 离线支持）
├── manifest.json           # PWA 清单
├── robots.txt              # SEO 爬虫配置
├── sitemap.xml             # XML 站点地图（~186 条 URL）
├── _redirects              # Cloudflare 路由重定向规则
├── functions/              # Cloudflare Worker 函数
│   ├── blog.js             # /blog 路由
│   ├── address/[address].js  # /address/:address 动态路由
│   └── blog/[slug].js      # /blog/:slug 动态路由
├── about/index.html
├── contact/index.html
├── privacy/index.html
├── terms/index.html
├── blog/                   # 博客文章（20+ 篇静态 HTML）
└── images/                 # 图标资源（favicon 各尺寸 + pwa_logo.png）
```

## 开发规范

### 无构建流程
- **没有 package.json、没有 npm、没有 webpack/vite**
- 直接编辑 HTML 文件，保存即生效
- CSS 全部写在 `<style>` 标签内（内联，不使用外部 .css 文件）
- JS 全部写在 `<script>` 标签内（内联，不使用外部 .js 文件，除 sw.js）

### 设计系统（CSS 变量）
所有页面共用以下设计变量（在每个 HTML 文件的 `:root` 中定义）：

```css
--bg:    #0a0f1e   /* 深海军蓝背景 */
--grad1: #4f8aff   /* 品牌渐变色：蓝 */
--grad2: #a855f7   /* 品牌渐变色：紫 */
--text:  #e8edf8   /* 正文浅色文字 */
--glass: rgba(255,255,255,0.04)  /* 玻璃拟态卡片背景 */
--mono:  'JetBrains Mono'        /* 等宽字体（地址/代码） */
--sans:  'DM Sans'               /* 正文字体 */
```

### 响应式断点
- 主内容最大宽度：`660px`（分析页）/ `760px`（内页）/ `800px`（博客）
- 移动端断点：`@media (max-width: 560px)` 和 `600px`

### 动画规范
页面统一使用以下关键帧动画：
- `fadeUp` — 元素淡入上移（页面加载时交错触发）
- `orbFloat` — 背景装饰球漂浮
- `pulse` — 状态指示灯脉冲

## 核心页面说明

### `index.html` — 首页
- 搜索框调用 `handleScan()` 跳转到 `/address/<addr>`
- FAQ 使用 `toggleFaq(index)` 切换展开/收起
- 博客预览卡片区域

### `address.html` — 钱包分析页（最核心）
- 从 URL 参数读取钱包地址
- 调用 Etherscan + CoinGecko API 获取数据
- 展示：余额快照、Token 持仓、交易记录（翻译为人类可读语言）
- 提供一键生成 AI 分析 Prompt（ChatGPT/Claude）

### `functions/address/[address].js` — Worker 动态路由
- 处理 `/address/:address` 路由，服务端渲染 SEO 信息
- 注意：修改此文件需通过 Cloudflare Pages 重新部署生效

## 博客文章
位于 `/blog/*.html`，20+ 篇文章，主题包括：
- 钱包分析案例（Vitalik、Binance 冷钱包等）
- 安全教育（钓鱼检测、红旗识别）
- DeFi 解读（Uniswap、Aave 交互）
- 功能使用指南

新增博客文章后需同步更新 `sitemap.xml` 和 `blog.html` 的列表。

## PWA 配置
- `manifest.json` — App 名称、图标、快捷方式
- `sw.js` — 缓存策略：
  - 静态资源 → Cache First
  - API 请求 → Network Only
  - 页面导航 → Network First，降级到缓存 index.html

## 部署流程

```bash
git add .
git commit -m "描述变更"
git push origin main
# Cloudflare Pages 自动触发构建部署
```

部署目标：`https://github.com/WinQi/cryptoucan.xyz.git`

## SEO 维护

修改内容后需要检查以下文件是否需要同步更新：
- `sitemap.xml` — 新增页面要添加条目（`<priority>` 和 `<changefreq>`）
- `robots.txt` — 一般不需要改动
- 每个页面的 `<meta og:*>` 和 `<meta name="description">` 标签

## 常见开发任务

### 新增博客文章
1. 在 `/blog/` 下新建 HTML 文件，复制现有文章结构
2. 在 `blog.html` 的文章列表中添加卡片
3. 在 `sitemap.xml` 添加该 URL 条目

### 修改首页内容
直接编辑 `index.html`，CSS 和 JS 均在文件内

### 修改钱包分析功能
编辑 `address.html`（核心逻辑全在此文件内）

### 修改路由或服务端逻辑
编辑 `functions/` 下对应的 `.js` Worker 文件

### 更新 PWA 图标
替换 `images/` 下对应尺寸的 PNG，并确认 `manifest.json` 路径一致
