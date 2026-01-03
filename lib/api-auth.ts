/**
 * API 路由认证辅助函数
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromHeaders } from "./auth";

/**
 * 包装 API 路由处理函数，自动处理认证
 * 如果用户未认证，自动返回 401
 * 
 * 使用示例：
 * export const GET = withAuth(async (request, user) => {
 *   // user 已经通过认证
 *   return NextResponse.json({ data: "..." });
 * });
 * 
 * 对于带 params 的路由：
 * export const DELETE = withAuth(async (request, user, context) => {
 *   const { id } = await context.params;
 *   // ...
 * });
 */
export function withAuth<
  TContext = unknown
>(
  handler: (
    request: NextRequest,
    user: { userId: string; email: string },
    context?: TContext
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context?: TContext
  ): Promise<NextResponse> => {
    const user = getUserFromHeaders(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(request, user, context);
  };
}

/**
 * 从请求中获取用户信息，如果未认证则返回 401
 */
export function requireAuth(request: NextRequest): { userId: string; email: string } {
  const user = getUserFromHeaders(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

