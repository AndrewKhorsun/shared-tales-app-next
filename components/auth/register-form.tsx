"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { OAuthButtons } from "./oauth-buttons";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/types";
import { Turnstile } from "@marsidev/react-turnstile";

export function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  function checkStrength(value: string) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    setPasswordStrength(score);
  }

  const strengthColors = ["bg-rust", "bg-[#8B6F5C]", "bg-moss", "bg-sage"];
  const strengthWidths = ["w-1/4", "w-1/2", "w-3/4", "w-full"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError(t("captchaRequired"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setLoading(true);

    const { error: apiError } = await api.post<AuthResponse>(
      "/api/auth/register",
      {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        turnstile_token: turnstileToken,
      },
    );

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    router.push("/books");
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rust/10 border border-rust/30 text-sm text-rust">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-fog mb-1.5 tracking-wide">
            {t("firstName")}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Elena"
            className="w-full h-11 bg-input border border-border-soft rounded-[10px] px-3.5 text-sm font-light text-parchment placeholder:text-fog/50 outline-none transition-all focus:border-border-active focus:shadow-[0_0_0_3px_rgba(201,169,110,0.10)] focus:bg-[#1b2719]"
          />
        </div>
        <div>
          <label className="block text-xs text-fog mb-1.5 tracking-wide">
            {t("lastName")}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Cross"
            className="w-full h-11 bg-input border border-border-soft rounded-[10px] px-3.5 text-sm font-light text-parchment placeholder:text-fog/50 outline-none transition-all focus:border-border-active focus:shadow-[0_0_0_3px_rgba(201,169,110,0.10)] focus:bg-[#1b2719]"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-fog mb-1.5 tracking-wide">
          {t("emailLabel")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-11 bg-input border border-border-soft rounded-[10px] px-3.5 text-sm font-light text-parchment placeholder:text-fog/50 outline-none transition-all focus:border-border-active focus:shadow-[0_0_0_3px_rgba(201,169,110,0.10)] focus:bg-[#1b2719]"
        />
      </div>

      <div className="flex gap-3">
        <div className="mb-4 flex-1">
          <label className="block text-xs text-fog mb-1.5 tracking-wide">
            {t("password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkStrength(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full h-11 bg-input border border-border-soft rounded-[10px] px-3.5 pr-10 text-sm font-light text-parchment placeholder:text-fog/50 outline-none transition-all focus:border-border-active focus:shadow-[0_0_0_3px_rgba(201,169,110,0.10)] focus:bg-[#1b2719]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fog p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="h-[3px] bg-elevated rounded-sm mt-2 overflow-hidden">
            <div
              className={`h-full rounded-sm transition-all duration-300 ${
                passwordStrength > 0
                  ? `${strengthWidths[passwordStrength - 1]} ${strengthColors[passwordStrength - 1]}`
                  : "w-0"
              }`}
            />
          </div>
        </div>

        <div className="mb-4 flex-1">
          <label className="block text-xs text-fog mb-1.5 tracking-wide">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 bg-input border border-border-soft rounded-[10px] px-3.5 text-sm font-light text-parchment placeholder:text-fog/50 outline-none transition-all focus:border-border-active focus:shadow-[0_0_0_3px_rgba(201,169,110,0.10)] focus:bg-[#1b2719]"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-[13px] font-light text-fog cursor-pointer mt-1">
        <input type="checkbox" className="sr-only peer" />
        <span className="w-4 h-4 bg-input border border-border-mid rounded flex items-center justify-center shrink-0 peer-checked:border-border-active peer-checked:bg-amber/15" />
        <span>
          {t("termsPrefix")}{" "}
          <a
            href="#"
            className="text-amber-dim hover:text-amber transition-colors"
          >
            {t("termsLink")}
          </a>{" "}
          {t("termsAnd")}{" "}
          <a
            href="#"
            className="text-amber-dim hover:text-amber transition-colors"
          >
            {t("privacyLink")}
          </a>
        </span>
      </label>
      <div className="mt-6">

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        onSuccess={(token) => setTurnstileToken(token)}
        onError={() => setError(t("captchaError"))}
        onExpire={() => setTurnstileToken("")}
        options={{ theme: "dark" }}
      />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11.5 bg-amber text-canvas rounded-[10px] text-[15px] font-medium mt-6 cursor-pointer hover:bg-[#D4B87C] active:scale-[0.97] transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("creatingAccount") : t("createAccount")}
      </button>

      <OAuthButtons />
    </form>
  );
}
