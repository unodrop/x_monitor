import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

/**
 * Send OTP email via Resend
 */
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your X Monitor Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #000; background-color: #fff; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #000;">X Monitor</h1>
              </div>
              
              <div style="background-color: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px;">
                <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; color: #000;">Verification Code</h2>
                
                <p style="font-size: 16px; color: #666; margin: 0 0 30px 0;">
                  Your verification code is:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div style="display: inline-block; background-color: #000; color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </div>
                </div>
                
                <p style="font-size: 14px; color: #999; margin: 30px 0 0 0;">
                  This code will expire in 60 seconds. If you didn't request this code, please ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  © ${new Date().getFullYear()} X Monitor. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Your X Monitor verification code is: ${otp}\n\nThis code will expire in 60 seconds. If you didn't request this code, please ignore this email.`,
    });
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw new Error("Failed to send email");
  }
}

