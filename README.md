# X Monitor - KOL 监控平台

一个现代化的 X (Twitter) KOL 监控平台，支持自动监控 KOL 推文、AI 智能过滤空投相关内容，并通过多种渠道实时推送通知。

## ✨ 功能特性

### 🔐 认证系统
- **邮箱 OTP 登录**：无需密码，通过邮箱验证码登录
- **JWT 认证**：安全的 Token 认证机制
- **HTTP-Only Cookie**：安全的会话管理

### 👥 KOL 管理
- **添加监控目标**：支持通过 X Handle 添加 KOL
- **自动获取信息**：自动获取 KOL 名称和用户 ID
- **状态管理**：支持暂停/恢复监控
- **批量管理**：支持多个 KOL 同时监控

### 📢 通知系统
- **多渠道支持**：
  - Telegram（支持 Bot、群组、话题）
  - Discord Webhook
  - 钉钉机器人
  - 飞书机器人
  - 自定义 Webhook
- **通知分组**：支持创建多个通知配置分组
- **灵活绑定**：每个 KOL 可绑定不同的通知分组

### 🤖 智能监控
- **自动检测**：定时检查 KOL 新推文（每 3 小时）
- **AI 过滤**：使用 DeepSeek AI 智能识别空投相关推文
- **内容过滤**：自动过滤回复和转发类型的推文
- **去重机制**：基于推文 ID 避免重复推送

### 📰 RSS 推送
- **每日新闻**：定时获取 RSS 源并推送到 Telegram
- **格式化消息**：美观的消息格式，支持 HTML

### 🎨 用户界面
- **现代化设计**：基于 Tailwind CSS 的黑白主题
- **响应式布局**：完美适配桌面和移动端
- **流畅动画**：平滑的过渡效果
- **Toast 通知**：优雅的操作反馈

## 🛠️ 技术栈

### 前端
- **Next.js 15**：使用 App Router
- **React 19**：最新版本的 React
- **TypeScript**：类型安全
- **Tailwind CSS 4**：现代化样式
- **Shadcn UI**：高质量 UI 组件
- **Lucide React**：图标库

### 后端
- **Next.js API Routes**：服务端 API
- **Supabase**：PostgreSQL 数据库
- **Redis (Upstash)**：OTP 存储和缓存
- **JWT (jose)**：Token 生成和验证

### 第三方服务
- **Resend**：邮件发送服务
- **RapidAPI**：Twitter/X API 集成
- **DeepSeek AI**：AI 内容过滤
- **Telegram Bot API**：Telegram 推送

## 📋 环境变量

创建 `.env.local` 文件，配置以下环境变量：

```env
# 数据库配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Redis 配置（Upstash）
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# JWT 密钥
JWT_SECRET=your_jwt_secret_key

# 邮件服务（Resend）
RESEND_API_KEY=your_resend_api_key

# RapidAPI Twitter
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_TWITTER_HOST=twitter241.p.rapidapi.com

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key

# Inngest（定时任务管理）
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Telegram RSS 推送（可选）
X_MONITOR_BOT_TOKEN=your_telegram_bot_token
X_MONITOR_CHAT_ID=your_telegram_chat_id
X_MONITOR_TOPIC_ID=your_telegram_topic_id

# RSS 源（可选）
RSS_FEED_URL=https://openai.com/news/rss.xml

# 应用配置
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/unodrop/x_monitor.git
cd x_monitor
```

### 2. 安装依赖

```bash
npm install
# 或
bun install
```

### 3. 配置数据库

在 Supabase 中执行 `db/schema.sql` 创建数据表：

```sql
-- 执行 schema.sql 中的所有 SQL 语句
```

### 4. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入配置。

### 5. 运行开发服务器

```bash
npm run dev
# 或
bun dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（包括 Inngest 配置）
4. 部署

### 定时任务配置（Inngest）

项目使用 [Inngest](https://www.inngest.com/) 管理定时任务，替代 Vercel Cron Jobs。

**为什么使用 Inngest？**
- Vercel 免费计划只支持 1 个 Cron Job
- Inngest 免费计划支持无限定时任务
- 更好的可观测性和错误处理

**定时任务：**
- **每日新闻推送**：每天 00:00 UTC 执行
- **KOL 推文检查**：每 3 小时执行一次

详细设置请参考 [Inngest 设置指南](./INNGEST_SETUP.md)。

## 📁 项目结构

```
x-monitor/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   │   └── cron/          # 定时任务
│   ├── dashboard/         # 仪表盘页面
│   └── login/             # 登录页面
├── components/            # React 组件
│   └── ui/               # UI 基础组件
├── db/                    # 数据库相关
│   ├── schema.sql        # 数据库 schema
│   ├── types.ts          # 类型定义
│   └── index.ts          # 数据库客户端
├── lib/                   # 工具函数
│   ├── auth.ts           # 认证相关
│   ├── twitter.ts        # Twitter API
│   ├── notifications.ts  # 通知发送
│   └── ...
├── middleware.ts          # Next.js 中间件
└── vercel.json           # Vercel 配置
```

## 🔧 使用指南

### 添加 KOL 监控

1. 登录系统
2. 在"KOL 管理"页面点击"添加监控目标"
3. 输入 X Handle（不含 @ 符号）
4. 选择通知分组（可选）
5. 系统会自动验证用户并获取信息

### 配置通知渠道

1. 在"通知分组"页面创建新分组
2. 选择推送渠道类型
3. 填写相应的配置信息：
   - **Telegram**：Bot Token、Chat ID、Topic ID（可选）
   - **Discord**：Webhook URL
   - **钉钉**：Webhook URL、Secret（可选）
   - **飞书**：Webhook URL
   - **自定义 Webhook**：Webhook URL

### 监控规则

- **推送内容**：仅推送空投相关的原创推文
- **过滤规则**：
  - 自动过滤回复类型的推文
  - 自动过滤转发（RT）类型的推文
  - 使用 AI 判断是否为空投相关内容
- **推送频率**：每 3 小时检查一次新推文

## 🧪 开发

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 类型检查

```bash
npx tsc --noEmit
```

## 📝 相关文档

- [KOL 监控设置指南](./KOL_MONITORING_SETUP.md)
- [Inngest 定时任务设置指南](./INNGEST_SETUP.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
