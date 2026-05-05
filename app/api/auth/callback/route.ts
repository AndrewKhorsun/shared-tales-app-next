import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
const DEFAULT_LOCALE = "en";

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? DEFAULT_LOCALE;
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/login`);
  }

  const exchangeRes = await fetch(`${API_URL}/api/auth/exchange-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!exchangeRes.ok) {
    return NextResponse.redirect(`${origin}/${locale}/login`);
  }

  const { token } = await exchangeRes.json();

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  const nextParam = request.nextUrl.searchParams.get("next") ?? "/books";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/books";
  return NextResponse.redirect(`${SITE_URL}/${locale}${next}`);
}
