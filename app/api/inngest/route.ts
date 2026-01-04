import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { checkTweetsFunction, dailyNewsFunction, dailyMetricsFunction } from "@/inngest/functions";

/**
 * Inngest API 路由
 * 用于接收 Inngest 的事件和触发函数执行
 * 
 * 注意：如果使用 Vercel Inngest 集成，会自动处理签名验证
 * 如果手动配置，需要确保 INNGEST_SIGNING_KEY 环境变量正确
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkTweetsFunction,
    dailyNewsFunction,
    dailyMetricsFunction,
  ],
});

