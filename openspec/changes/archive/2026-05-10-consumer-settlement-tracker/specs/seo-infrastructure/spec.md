## ADDED Requirements

### Requirement: 静态站点生成
系统必须能够在构建阶段生成全站静态HTML文件，以确保最快的首次内容绘制（FCP）时间和最佳的搜索引擎抓取效率。

#### Scenario: 部署构建过程
- **WHEN** 代码推送到主分支或由定时任务触发
- **THEN** 构建系统根据最新的数据集合生成静态HTML页面。

### Requirement: SEO 元数据管理
每个页面（特别是各个具体的赔偿详情页）必须包含独立的、高度相关的 `<title>` 和 `<meta description>`，以捕获特定项目名称的长尾搜索流量。

#### Scenario: 搜索引擎机器人抓取详情页
- **WHEN** 搜索引擎抓取工具请求一个赔偿详情页（如：Facebook 隐私和解金）
- **THEN** HTML 响应的 `<head>` 部分包含该赔偿专属的标题和摘要描述。

### Requirement: 结构化数据 (Schema.org)
页面应该包含适当的结构化数据（如 Article 或 Event），以帮助搜索引擎更好地理解页面内容并可能展示富文本摘要（Rich Snippets）。

#### Scenario: Google 验证页面结构化数据
- **WHEN** 通过 Google Rich Results Test 测试详情页面
- **THEN** 页面能够被正确识别为包含有效的结构化数据标记。
