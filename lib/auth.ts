import { cookies } from "next/headers";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { verifyToken, type JWTPayload } from "./jwt";

const COOKIE_NAME = "auth_token";

/**
 * Get the current authenticated user from the cookie
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * Get user info from request headers (set by middleware)
 * This is faster than verifying the token again
 */
export function getUserFromHeaders(
  request?: NextRequest | Request
): JWTPayload | null {
  let headersObj: Headers;
  
  if (request) {
    headersObj = request.headers;
  } else {
    // Try to get from Next.js headers() if available
    try {
      headersObj = headers() as unknown as Headers;
    } catch {
      return null;
    }
  }

  const userId = headersObj.get("x-user-id");
  const email = headersObj.get("x-user-email");

  if (!userId || !email) {
    return null;
  }

  return {
    userId,
    email,
  };
}

/**
 * Set the auth token in an HTTP-only cookie
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Remove the auth token cookie
 */
export async function removeAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

