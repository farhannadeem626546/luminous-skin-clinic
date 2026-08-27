import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, validAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { email = "", password = "" } = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!validAdminCredentials(email, password)) return NextResponse.json({ message: "Incorrect email or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
