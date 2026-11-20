import { NextResponse } from "next/server";
import { getReferrals } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const code = (new URL(req.url).searchParams.get("code") || "")
    .toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const empty = NextResponse.json({ count: 0, friends: [] });
  if (code.length < 4 || !process.env.SHEETS_WEBHOOK_URL) return empty;
  try {
    const j = await getReferrals(code);
    return NextResponse.json({ count: j.count || 0, friends: j.friends || [] });
  } catch {
    return empty;
  }
}