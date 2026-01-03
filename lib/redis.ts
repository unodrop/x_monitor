import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("REDIS_URL environment variable is not set");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Helper function to get OTP key
export function getOtpKey(email: string): string {
  return `auth:email:${email}`;
}

// Helper function to set OTP with TTL
export async function setOtp(email: string, code: string): Promise<void> {
  const key = getOtpKey(email);
  await redis.setex(key, 60 * 5, code); // TTL: 5 minutes
}

// Helper function to get and delete OTP
export async function getAndDeleteOtp(email: string): Promise<string | null> {
  const key = getOtpKey(email);
  const code = await redis.get(key);
  
  // Upstash Redis returns the value directly, or null if not found
  if (code) {
    await redis.del(key);
    // Ensure we return a string
    return typeof code === 'string' ? code : String(code);
  }
  
  return null;
}

