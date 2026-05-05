"use client";

import { useState } from "react";
import { BookOpen, Mail } from "lucide-react";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("loading");
    const { error } = await api.post("/api/auth/resend-verification", {});
    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-10">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <BookOpen className="w-7 h-7 text-sage" strokeWidth={1.2} />
          <span className="font-sans text-base font-medium text-parchment tracking-wide">
            Shared Tales
          </span>
        </div>

        <div className="w-14 h-14 rounded-full bg-elevated border border-border-soft flex items-center justify-center mx-auto mb-6">
          <Mail className="w-6 h-6 text-sage" strokeWidth={1.2} />
        </div>

        <h1 className="font-serif text-[26px] text-parchment mb-3">
          Verify your email
        </h1>
        <p className="text-sm font-light text-fog leading-relaxed mb-8 max-w-sm mx-auto">
          We sent a verification link to your email address. Click the link to activate your account and start writing.
        </p>

        {status === "sent" && (
          <div className="mb-6 p-3 rounded-lg bg-sage/10 border border-sage/30 text-sm text-sage">
            Verification email sent. Check your inbox.
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-3 rounded-lg bg-rust/10 border border-rust/30 text-sm text-rust">
            Something went wrong. Please try again.
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={status === "loading" || status === "sent"}
          className="w-full h-11 bg-elevated border border-border-mid rounded-[10px] text-sm text-parchment cursor-pointer hover:border-border-active transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending..." : status === "sent" ? "Email sent" : "Resend verification email"}
        </button>
      </div>
    </div>
  );
}
