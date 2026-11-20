import { NextResponse } from "next/server";
import crypto from "crypto";
import { COOKIE, token } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req) {
  const { key } = (await req.json().catch(() => ({}))) || {};
  const k = process.env.ADMIN_KEY || "";
  const ok =
    k && typeof key === "string" && key.length === k.length &&
    crypto.timingSafeEqual(Buffer.from(key), Buffer.from(k));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
    return NextResponse.json({ error: "Chiave non valida." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token(), {
    httpOnly: true, sameSite: "strict", path: "/",
    secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}