import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/sheets";

export const runtime = "nodejs";

// Stored with every sign-up as proof of consent. Keep it identical to the text on the form.
const CONSENT_TEXT =
  "Acconsento al trattamento dei miei dati solo per partecipare alla Convenzione Popolare. Non verranno mai venduti a nessuno. Se mi ha invitato un amico, potrà vedere il mio nome e l'iniziale del cognome. (privacy policy v2)";

const newCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

function validContact(v) {
  const email = /^[^\s@,&]+@[^\s@,&]+\.[^\s@,&]{2,}$/;
  const digits = v.replace(/[\s().+-]/g, "");
  return email.test(v) || /^\d{8,15}$/.test(digits);
}

export async function POST(req) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (b.website) return NextResponse.json({ ok: true, code: newCode() });

  const first = String(b.firstName || "").trim().slice(0, 50);
  const last = String(b.lastName || "").trim().slice(0, 50);
  const contact = String(b.contact || "").trim().slice(0, 120);
  const area = String(b.area || "").trim().slice(0, 60);
  const ref = String(b.ref || "").trim().slice(0, 12).replace(/[^A-Z0-9]/gi, "").toUpperCase();

  if (first.length < 2) return NextResponse.json({ error: "Inserisci il tuo nome." }, { status: 400 });
  if (last.length < 2) return NextResponse.json({ error: "Inserisci il tuo cognome." }, { status: 400 });
  if (area.length < 2) return NextResponse.json({ error: "Inserisci la tua città o il CAP." }, { status: 400 });
  if (!validContact(contact))
    return NextResponse.json({ error: "Inserisci un numero WhatsApp o un'email valida." }, { status: 400 });
  if (b.consent !== true)
    return NextResponse.json({ error: "Devi accettare il trattamento dei dati per aderire." }, { status: 400 });
  if (!process.env.SHEETS_WEBHOOK_URL)
    return NextResponse.json({ error: "Servizio non configurato." }, { status: 500 });

  const isMail = contact.includes("@");

  try {
    const res = await addSubscriber({
      name: `${first} ${last}`,
      first, last, area, ref, contact,
      email: isMail ? contact : "",
      phone: isMail ? "" : contact,
      code: newCode(),
      consent: true,
      consentText: CONSENT_TEXT,
    });
    if (!res.ok) throw new Error(res.error || "sheet error");
    return NextResponse.json({ ok: true, code: res.code });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Errore temporaneo. Riprova tra un momento." }, { status: 502 });
  }
}