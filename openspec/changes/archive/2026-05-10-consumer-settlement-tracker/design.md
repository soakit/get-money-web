## Context

美国有很多集体诉讼赔偿（Class Action Settlements）由于申请复杂或信息差，导致很多符合条件的消费者错过了领钱机会。现有的一些资讯平台（例如 topclassactions.com）商业化过重，广告满天飞，导致用户体验极差。我们需要一个极简、极速、基于静态页面的站点，帮助用户尤其是关注“无需购买凭证（No Proof Required）”分类的用户，快速找到并申请这些补偿，最终通过金融和法律领域的会员返利（Affiliate）来实现商业化。

## Goals / Non-Goals

**Goals:**
- 提供一个极速的静态Web应用体验（使用 Astro 框架构建）。
- 建立并展示一个结构化的消费者赔偿数据库（首期数据可通过抓取或手动整理构建）。
- 提供多维度的数据筛选器（按赔款金额、是否需要收据、申请截止日期等）。
- 实现无广告的极简UI设计，以构建用户信任。
- 自动化部署至 Cloudflare Pages。
- 实现SEO友好的页面结构，便于搜索引擎抓取长尾关键词。

**Non-Goals:**
- 后端用户注册或登录系统（纯公开静态内容站）。
- 自动代申请服务（只提供跳转到官方申请页面的能力）。
- 复杂的动态广告接入。

## Decisions

- **框架选择**: Astro。因为此项目核心是内容分发和SEO，Astro的“零JS”默认策略和卓越的渲染速度非常适合该场景。
- **UI 组件库**: Tailwind CSS 配合简单的无头组件（如 Headless UI 或 Radix，如果需要交互）。我们优先追求设计美感（高对比度，干净排版），Tailwind CSS 足以支持。
- **数据管理**: 初期使用本地 JSON/Markdown 文件或轻量级的本地 SQLite/Content Collections 存储赔偿项目数据。便于构建期静态生成页面。
- **部署平台**: Cloudflare Pages。全球 CDN 分发，静态页面托管免费且极速，集成 GitHub 自动部署。
- **数据结构**: 每个 Settlement 包含字段：标题、描述、预计赔偿金额、截止日期、是否需要收据、申请链接、Affiliate 标记（如有）。

## Risks / Trade-offs

- **数据更新频率**: 静态站意味着每次数据更新都需要重新构建部署。权衡：我们可以通过设置每天定时构建（Cron Job via GitHub Actions）或通过 CMS 的 Webhook 触发构建来解决。
- **初期流量获取**: 初期没有用户积累，强依赖 SEO 和社交媒体推荐。权衡：网站体验越好，加载越快，Google SEO 排名越有利。
