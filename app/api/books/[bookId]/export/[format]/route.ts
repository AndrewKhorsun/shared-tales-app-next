import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string; format: string }> },
) {
  const { bookId, format } = await params;
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${API_URL}/api/books/${bookId}/export/${format}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Export failed" }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
  const contentDisposition = res.headers.get("Content-Disposition") ?? `attachment; filename="book.${format}"`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
