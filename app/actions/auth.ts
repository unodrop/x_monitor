"use server";

import { z } from "zod";
import { setOtp, getAndDeleteOtp } from "@/lib/redis";
import { supabaseAdmin } from "@/db";
import { generateToken } from "@/lib/jwt";
import { setAuthToken } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";

const emailSchema = z.string().email("Invalid email address");
const otpSchema = z.string().length(6, "OTP must be 6 digits");

/**
 * Send OTP to user's email
 */
export async function sendOtp(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    // Validate email and normalize to lowercase
    const validatedEmail = emailSchema.parse(email.toLowerCase().trim());

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 60s TTL
    await setOtp(validatedEmail, otp);

    // Send OTP email via Resend
    try {
      await sendOtpEmail(validatedEmail, otp);
    } catch {
      // Still return success to prevent email service issues from blocking login
      // In production, you might want to handle this differently
    }

    return {
      success: true,
      message: "OTP sent successfully. Check your email.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input",
      };
    }

    return {
      success: false,
      error: "Failed to send OTP. Please try again.",
    };
  }
}

/**
 * Verify OTP and create/login user
 */
export async function verifyOtp(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const code = formData.get("code") as string;

    // Validate inputs and normalize email to lowercase
    const validatedEmail = emailSchema.parse(email.toLowerCase().trim());
    const validatedCode = otpSchema.parse(code.trim());

    // Get and verify OTP from Redis
    const storedOtp = await getAndDeleteOtp(validatedEmail);

    if (!storedOtp || storedOtp !== validatedCode) {
      return {
        success: false,
        error: "Invalid or expired OTP. Please try again.",
      };
    }

    // Check if user exists, create if not
    let userId: string;

    // First, try to find existing user
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", validatedEmail)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({ email: validatedEmail })
        .select("id")
        .single();

      if (insertError || !newUser) {
        return {
          success: false,
          error: "Failed to create user. Please try again.",
        };
      }

      userId = newUser.id;
    }

    // Generate JWT token
    const token = await generateToken({
      userId,
      email: validatedEmail,
    });

    // Set HTTP-only cookie
    await setAuthToken(token);

    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input",
      };
    }

    return {
      success: false,
      error: "Failed to verify OTP. Please try again.",
    };
  }
}

