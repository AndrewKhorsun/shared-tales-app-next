import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";
const DEFAULT_LOCALE = "en";

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? DEFAULT_LOCALE;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/${locale}/login`);
  }

  const verifyRes = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!verifyRes.ok) {
    return NextResponse.redirect(`${origin}/${locale}/login`);
  }

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.redirect(`${origin}/${locale}/dashboard`);
}
