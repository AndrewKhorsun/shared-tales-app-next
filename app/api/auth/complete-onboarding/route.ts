import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${API_URL}/api/auth/complete-onboarding`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!backendRes.ok) {
    return NextResponse.json({ error: "Failed" }, { status: backendRes.status });
  }

  return NextResponse.json({ ok: true });
}
