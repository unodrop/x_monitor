# KOL 推文监控设置指南

## 功能说明

KOL 推文监控功能会自动检查已添加的监控目标（KOL）的最新推文，当发现新推文时，会通过配置的通知渠道发送通知。

## 数据库更新

首先需要在数据库中执行以下 SQL 来添加 `last_tweet_id` 字段：

```sql
ALTER TABLE monitor_targets 
ADD COLUMN IF NOT EXISTS last_tweet_id TEXT;
```

## 环境变量配置

在 `.env.local` 或部署环境变量中添加：

```env
# RapidAPI 配置
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_TWITTER_HOST=twitter-api45.p.rapidapi.com  # 可选，根据实际使用的 API 调整
```

## RapidAPI Twitter API 说明

当前实现使用了通用的 RapidAPI Twitter API 端点。根据你实际使用的 RapidAPI 服务，可能需要调整以下内容：

### 1. API 端点

在 `lib/twitter.ts` 中，当前使用的端点是：
- 获取用户信息：`/username.php?username={username}`
- 获取用户推文：`/timeline.php?id={userId}&count={count}&since_id={sinceId}`

如果使用的 API 端点不同，请修改 `lib/twitter.ts` 中的 URL。

### 2. 响应格式

当前代码假设 API 返回的格式为：
- 用户信息：`{ id: string, username: string, name: string, ... }`
- 推文列表：`{ timeline: Array<{ id: string, text: string, created_at: string, ... }> }`

如果实际 API 返回格式不同，请相应调整 `lib/twitter.ts` 中的解析逻辑。

### 3. 常见 RapidAPI Twitter API 服务

- **Twitter API v2 by RapidAPI**: 使用标准的 Twitter API v2 格式
- **Twitter API v1.1 by RapidAPI**: 使用 Twitter API v1.1 格式
- **其他第三方 Twitter API 服务**: 格式可能不同

## 定时任务配置

### Vercel Cron Jobs

在 `vercel.json` 中添加：

```json
{
  "crons": [
    {
      "path": "/api/cron/check-tweets",
      "schedule": "0 */3 * * *"
    }
  ]
}
```

这将在每 3 小时执行一次检查（在每小时的整点执行，即 0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00, 21:00）。

### 其他平台

使用外部 cron 服务（如 cron-job.org、EasyCron 等）定期调用：
```
GET https://your-domain.com/api/cron/check-tweets
```

建议频率：每 3 小时检查一次。

## 使用流程

1. **添加监控目标**：
   - 在 Dashboard 页面添加要监控的 KOL
   - 输入 X (Twitter) handle（例如：`elonmusk`）
   - 选择通知渠道配置

2. **配置通知渠道**：
   - 在"通知分组"页面创建通知配置
   - 支持 Telegram、Discord、钉钉、飞书、自定义 Webhook

3. **自动监控**：
   - 定时任务会自动检查所有活跃的监控目标
   - 发现新推文时，会通过配置的渠道发送通知
   - 首次监控时，只发送最新的一条推文（避免历史推文轰炸）

## 消息格式

推文通知的格式示例：

```
🐦 Elon Musk (@elonmusk)

这是推文内容...

查看推文

❤️ 1234 • 🔄 567 • 💬 89
```

## 注意事项

1. **API 限制**：注意 RapidAPI 的调用频率限制，避免超出配额
2. **首次监控**：首次添加监控目标时，只会发送最新的一条推文，不会发送历史推文
3. **错误处理**：如果某个监控目标出错，不会影响其他目标的处理
4. **推文 ID**：使用推文 ID 来跟踪已处理的推文，确保不会重复发送通知

## 故障排查

### 推文获取失败

1. 检查 `RAPIDAPI_KEY` 是否正确配置
2. 检查 `RAPIDAPI_TWITTER_HOST` 是否匹配实际使用的 API
3. 查看 API 响应格式是否与代码中的解析逻辑匹配

### 通知发送失败

1. 检查通知渠道配置是否正确（Token、Chat ID、Webhook URL 等）
2. 查看定时任务的错误日志
3. 确认通知渠道的服务是否正常

### 重复通知

1. 检查数据库中的 `last_tweet_id` 是否正确更新
2. 确认推文 ID 的比较逻辑是否正确（字符串比较 vs 数字比较）

