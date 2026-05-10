## 1. 项目初始化与配置

- [x] 1.1 使用 Astro CLI 初始化新项目（使用最简模板）。
- [x] 1.2 安装并配置 Tailwind CSS。
- [x] 1.3 配置项目目录结构（`src/pages`, `src/components`, `src/content`, `src/layouts`）。

## 2. 数据结构设计与Mock数据

- [x] 2.1 在 `src/content/settlements` 目录下定义赔偿项目的数据 schema (Zod 验证)。包含标题、描述、金额、截止日期、是否需要收据、官方链接等字段。
- [x] 2.2 创建 5-10 个真实的或 Mock 的赔偿项目 Markdown 文件用于开发测试。

## 3. 核心UI与页面开发

- [x] 3.1 创建全局 Layout 组件，包含统一的头部导航、页脚和基本的 SEO Meta 标签。
- [x] 3.2 开发 `SettlementCard` 组件，展示单个赔偿项的概览信息。
- [x] 3.3 开发主页 (`index.astro`)，读取并渲染所有赔偿项目列表。
- [x] 3.4 在主页实现“无需凭证（No Proof Required）”的筛选逻辑（可通过纯 CSS 或极简的前端 JS 实现过滤）。
- [x] 3.5 开发赔偿详情页 (`[slug].astro`)，根据数据动态生成每个项目的专属详情页面。

## 4. SEO基础设施

- [x] 4.1 在全局 Layout 中集成动态传入的 `<title>` 和 `<meta description>` 标签。
- [x] 4.2 开发一个组件生成结构化数据 (JSON-LD) 插入到详情页 `<head>` 中，标记页面内容为 `Article` 或 `Event`。
- [x] 4.3 配置 `@astrojs/sitemap` 插件自动生成 `sitemap.xml`。

## 5. 部署与上线配置

- [x] 5.1 创建并配置 Wrangler / Cloudflare Pages 设置（如需）。
- [x] 5.2 编写 `.github/workflows/deploy.yml`，设置推送到主分支时自动部署到 Cloudflare Pages（或直接在 Cloudflare 后台关联 GitHub 仓库）。
- [x] 5.3 在本地执行构建测试 (`npm run build`) 确保静态页面生成无误。
