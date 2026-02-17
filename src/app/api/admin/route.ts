import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST: Admin login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret } = body;

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ success: true });
}

// DELETE: Admin logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ success: true });
}

// GET: Check admin status
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token?.value === process.env.ADMIN_SECRET) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
