import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for the user
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, string>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

