# Inngest 定时任务设置指南

## 简介

本项目使用 [Inngest](https://www.inngest.com/) 来管理定时任务，替代 Vercel 的 Cron Jobs。Inngest 提供更灵活的定时任务管理，无数量限制，并且提供更好的可观测性和错误处理。

## 为什么使用 Inngest？

- ✅ **无数量限制**：Vercel 免费计划只支持 1 个 Cron Job，Inngest 免费计划支持无限定时任务
- ✅ **更好的可观测性**：提供详细的执行日志和监控
- ✅ **自动重试**：内置重试机制
- ✅ **事件驱动**：支持更复杂的工作流编排

## 安装

```bash
npm install inngest
```

## 环境变量配置

### 使用 Vercel Inngest 集成（推荐）

**好消息**：如果你通过 Vercel 使用 Inngest，通常**不需要手动配置环境变量**！

Vercel 会自动处理 Inngest 集成，你只需要：

1. **在 Vercel Dashboard 中启用 Inngest**：
   - 进入你的 Vercel 项目
   - 在 **Integrations** 中找到 **Inngest**
   - 点击 **Add Integration** 并授权

2. **函数会自动被发现**：
   - 函数放在 `inngest/functions.ts` 中
   - Vercel 会自动发现并注册这些函数
   - 无需手动配置 Webhook URL

### 手动配置（如果需要）

如果你不使用 Vercel 集成，或者需要手动配置：

在 `.env.local` 中添加：

```env
# Inngest 配置（可选，Vercel 集成通常不需要）
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

**如何获取这些 Key：**
1. 登录 [Inngest Dashboard](https://app.inngest.com/)
2. 选择你的 App
3. 进入 **Settings** → **Keys**
4. 复制 `Event Key` 和 `Signing Key`

## 设置步骤

### 1. 创建 Inngest 账户

1. 访问 [Inngest](https://www.inngest.com/)
2. 注册账户（免费计划即可）
3. 创建一个新的 App

### 2. Vercel 集成（推荐）

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 **Settings** → **Integrations**
3. 搜索并添加 **Inngest** 集成
4. 授权后，Vercel 会自动配置所有必要的设置
5. 部署代码后，函数会自动注册

### 3. 配置 Inngest Dev Server（本地开发）

安装 Inngest CLI：

```bash
npm install -g inngest-cli
```

启动 Inngest Dev Server：

```bash
inngest-cli dev
```

这会启动一个本地 Inngest 服务器，用于开发和测试。

### 3. 部署到生产环境

#### Vercel 部署（使用 Vercel Inngest 集成）

1. **启用 Inngest 集成**：
   - 在 Vercel Dashboard 中，进入项目设置
   - 在 **Integrations** 中添加 **Inngest**
   - 授权后，Vercel 会自动处理所有配置

2. **确保函数文件存在**：
   - 函数应该放在 `inngest/functions.ts` 中
   - API 路由在 `app/api/inngest/route.ts`

3. **部署代码**：
   ```bash
   git push
   ```
   部署后，Vercel 会自动：
   - 发现 `inngest/functions.ts` 中的函数
   - 注册到 Inngest
   - 配置 Webhook URL

#### 手动部署（不使用 Vercel 集成）

1. 在 Vercel 项目设置中添加环境变量：
   - `INNGEST_EVENT_KEY`
   - `INNGEST_SIGNING_KEY`

2. 在 Inngest Dashboard 中配置 Webhook：
   - 进入你的 App 设置
   - 添加 Webhook URL: `https://your-domain.com/api/inngest`

3. 部署代码后，Inngest 会自动发现并注册函数

#### 其他平台

确保：
- 环境变量已正确配置
- `/api/inngest` 路由可以公开访问
- Inngest Dashboard 中配置了正确的 Webhook URL

## 定时任务说明

### 1. KOL 推文监控 (`check-tweets`)

- **频率**：每 3 小时执行一次
- **功能**：检查所有活跃的 KOL 新推文，过滤空投相关内容并推送通知
- **Cron 表达式**：`0 */3 * * *`

### 2. 每日新闻推送 (`daily-news`)

- **频率**：每天 00:00 UTC 执行
- **功能**：获取 RSS 源内容并推送到 Telegram
- **Cron 表达式**：`0 0 * * *`

## 监控和调试

### Inngest Dashboard

访问 Inngest Dashboard 可以：
- 查看所有函数的执行历史
- 查看执行日志和错误信息
- 手动触发函数执行
- 查看执行统计

### 本地开发

使用 Inngest Dev Server 可以在本地测试定时任务：

```bash
# 启动 Next.js 开发服务器
npm run dev

# 在另一个终端启动 Inngest Dev Server
inngest-cli dev
```

## 迁移说明

### 从 Vercel Cron 迁移

1. ✅ 已创建 Inngest 函数（`inngest/functions.ts`）
2. ✅ 已创建 Inngest API 路由（`app/api/inngest/route.ts`）
3. ✅ 已更新 `vercel.json`（移除 Cron 配置）
4. ✅ 已更新 `middleware.ts`（允许 Inngest API 路由）

### 保留旧的 Cron 路由（可选）

旧的 `/api/cron/*` 路由仍然保留，可以用于：
- 手动触发测试
- 作为备用方案
- 外部服务调用

## 故障排查

### 函数未执行

1. 检查 Inngest Dashboard 中的函数是否已注册
2. 检查环境变量是否正确配置
3. 检查 Webhook URL 是否正确
4. 查看 Inngest Dashboard 中的错误日志

### 函数执行失败

1. 查看 Inngest Dashboard 中的执行日志
2. 检查函数代码中的错误处理
3. 查看应用日志（Vercel Logs 等）

## 参考文档

- [Inngest 官方文档](https://www.inngest.com/docs)
- [Inngest Next.js 集成](https://www.inngest.com/docs/quick-start/nextjs)
- [Inngest Cron 任务](https://www.inngest.com/docs/guides/scheduled-functions)

