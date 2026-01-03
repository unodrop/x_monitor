# 定时任务配置说明

## 功能说明

定时任务会在每天早上 8 点执行，自动：
1. 从 RSS 聚合器（默认：https://openai.com/news/rss.xml）读取最新内容
2. 使用 AI 总结和格式化内容
3. 发送到所有配置了 Telegram 通知的用户群组/话题

## 配置方法

### 方法 1: 使用 Vercel Cron Jobs（推荐）

如果部署在 Vercel，在项目根目录创建 `vercel.json`：

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-news",
      "schedule": "0 8 * * *"
    }
  ]
}
```

然后在 Vercel Dashboard 的环境变量中添加：
- `CRON_SECRET`: 用于保护 API 的安全密钥（可选但推荐）

### 方法 2: 使用外部 Cron 服务

可以使用以下服务定期调用 API：

1. **cron-job.org** (https://cron-job.org)
   - 创建任务
   - URL: `https://your-domain.com/api/cron/daily-news`
   - 时间: 每天 8:00 (UTC)
   - 如果需要，添加 Header: `Authorization: Bearer YOUR_CRON_SECRET`

2. **GitHub Actions**
   创建 `.github/workflows/daily-news.yml`:
   ```yaml
   name: Daily News Cron
   on:
     schedule:
       - cron: '0 8 * * *'  # UTC 时间每天 8 点
     workflow_dispatch:  # 允许手动触发
   
   jobs:
     send-news:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger API
           run: |
             curl -X GET "https://your-domain.com/api/cron/daily-news" \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
   ```

3. **其他服务**
   - EasyCron
   - Cronitor
   - 任何支持 HTTP 请求的 cron 服务

### 方法 3: 本地测试

可以直接访问 API 端点进行测试：

```bash
curl -X GET "http://localhost:3000/api/cron/daily-news" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 环境变量

在 `.env.local` 或部署平台的环境变量中配置：

```env
# Telegram 配置（必需）
X_MONITOR_BOT_TOKEN=your-telegram-bot-token
X_MONITOR_CHAT_ID=your-telegram-chat-id
X_MONITOR_TOPIC_ID=your-topic-id  # 可选，论坛话题 ID

# RSS 源地址（可选，默认使用 OpenAI RSS）
RSS_FEED_URL=https://openai.com/news/rss.xml

# DeepSeek API Key（用于 AI 总结，必需）
DEEPSEEK_API_KEY=your-deepseek-api-key
```

## API 端点

- **路径**: `/api/cron/daily-news`
- **方法**: GET
- **认证**: 如果设置了 `CRON_SECRET`，需要在 Header 中提供：
  ```
  Authorization: Bearer YOUR_CRON_SECRET
  ```

## 返回格式

成功时返回：
```json
{
  "success": true,
  "message": "Processed 3 configs",
  "results": [
    {
      "configId": "...",
      "configName": "Telegram 群组1",
      "success": true
    }
  ],
  "feedTitle": "OpenAI News",
  "itemsCount": 10
}
```

失败时返回：
```json
{
  "success": false,
  "error": "Error message"
}
```

## 注意事项

1. **时区**: Cron 表达式使用 UTC 时间，需要根据你的时区调整
   - 中国时间（UTC+8）早上 8 点 = UTC 时间 0 点
   - 所以应该设置为 `0 0 * * *`

2. **RSS 源**: 默认使用 OpenAI RSS，可以通过环境变量 `RSS_FEED_URL` 修改

3. **AI 总结**: 如果 AI 总结失败，会使用原始 RSS 内容的格式化版本

4. **Telegram 配置**: 只会发送到配置了 Telegram 且设置了 `topicId` 的通知分组

