import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;
if (!TURNSTILE_SECRET_KEY) throw new Error("Missing TURNSTILE_SECRET_KEY");

export async function POST(request: Request) {
  const { email, password, first_name, last_name, turnstile_token } =
    await request.json();

  if (!email || !password || !first_name || !last_name) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstile_token,
      }),
    },
  );

  const data = await response.json();

  if (!data.success) {
    return NextResponse.json(
      { error: "Captcha verification failed" },
      { status: 400 },
    );
  }

  const registerRes = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, first_name, last_name }),
  });

  const registerData = await registerRes.json();

  if (!registerRes.ok) {
    return NextResponse.json(
      { error: registerData.error || "Registration failed" },
      { status: registerRes.status },
    );
  }

  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    return NextResponse.json(
      { error: loginData.error || "Auto-login failed" },
      { status: loginRes.status },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("token", loginData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ user: loginData.user });
}
