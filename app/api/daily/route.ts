import { NextResponse } from "next/server";
import { getDailyMetrics } from "@/lib/daily-metrics";

/**
 * GET /api/daily
 * 获取加密货币日报数据
 */
export async function GET() {
  try {
    const data = await getDailyMetrics();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Error] Error fetching daily data:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch daily data" },
      { status: 500 }
    );
  }
}

