import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.value}` },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Failed to resend verification email" },
      { status: res.status }
    );
  }

  return NextResponse.json({ message: data.message });
}
