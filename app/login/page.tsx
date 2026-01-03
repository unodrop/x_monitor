"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { sendOtp, verifyOtp } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const result = await sendOtp(formData);

      if (result.success) {
        setStep("verify");
      } else {
        setError(result.error || "Failed to send OTP");
      }
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);

      const result = await verifyOtp(formData);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid OTP");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-black to-gray-900 shadow-lg transition-transform duration-200 hover:scale-105 dark:from-white dark:to-gray-100">
            <span className="text-2xl font-bold text-white dark:text-black">X</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
            X Monitor
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            KOL 监控平台
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-black/10 bg-white/95 backdrop-blur-xl p-8 shadow-2xl dark:border-white/10 dark:bg-gray-950/95">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div
              className={`h-2 w-12 rounded-full transition-all duration-300 ${
                step === "email"
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
            <div
              className={`h-2 w-12 rounded-full transition-all duration-300 ${
                step === "verify"
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50/90 p-4 text-sm font-medium text-red-900 shadow-sm dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Email Step */}
          <div
            className={`space-y-6 transition-all duration-300 ${
              step === "email"
                ? "opacity-100 translate-y-0"
                : "absolute opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div>
              <h2 className="mb-1 text-lg font-semibold text-black dark:text-white">
                输入邮箱地址
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                我们将向您的邮箱发送验证码
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-black dark:text-white"
                >
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="block w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 py-3.5 text-black shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/10 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-gray-900 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-100 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>发送中</span>
                  </>
                ) : (
                  "发送验证码"
                )}
              </button>
            </form>
          </div>

          {/* Verification Step */}
          <div
            className={`space-y-6 transition-all duration-300 ${
              step === "verify"
                ? "opacity-100 translate-y-0"
                : "absolute opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                disabled={isPending}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-black dark:text-gray-400 dark:hover:text-white disabled:opacity-50 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                返回修改邮箱
              </button>
              <h2 className="mb-1 text-lg font-semibold text-black dark:text-white">
                输入验证码
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                验证码已发送至 <span className="font-medium text-black dark:text-white">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-semibold text-black dark:text-white"
                >
                  6 位验证码
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  disabled={isPending}
                  className="block w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-center text-2xl font-mono tracking-[0.3em] text-black shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/10 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white/10"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isPending || code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-gray-900 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-100 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>验证中</span>
                  </>
                ) : (
                  "验证并登录"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

