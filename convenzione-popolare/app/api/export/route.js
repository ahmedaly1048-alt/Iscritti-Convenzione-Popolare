import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listSubscribers } from "@/lib/sheets";
import { parseRows } from "@/lib/contacts";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// Logged-in admins download from the dashboard; /api/export?key=ADMIN_KEY also works.
export async function GET(req) {
  const key = new URL(req.url).searchParams.get("key");
  const ok = isAdmin(cookies()) || (process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
  if (!ok) return new NextResponse("Non autorizzato", { status: 401 });

  const data = await listSubscribers();
  if (!data.ok) return new NextResponse("Errore", { status: 502 });

  const head = ["Nome", "Cognome", "Data", "Città", "Email", "Telefono", "Codice", "Invitato da"];
  const body = parseRows(data.rows).map((c) => [c.first, c.last, c.date, c.city, c.email, c.phone, c.code, c.ref]);
  const csv = "\uFEFF" + [head, ...body].map((r) => r.map(esc).join(",")).join("\r\n");
  const day = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="iscritti-${day}.csv"`,
    },
  });
}