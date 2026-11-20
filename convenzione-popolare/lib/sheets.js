const URL_ = process.env.SHEETS_WEBHOOK_URL;
const SECRET = process.env.SHEETS_SECRET;
const q = (s) => encodeURIComponent(s);

export async function getCount() {
  const base = Number(process.env.BASE_COUNT || 0);
  if (!URL_) return base;
  try {
    const r = await fetch(`${URL_}?action=count&secret=${q(SECRET)}`, { next: { revalidate: 60 } });
    const j = await r.json();
    return base + (j.count || 0);
  } catch {
    return base;
  }
}

export async function addSubscriber(payload) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, secret: SECRET }),
    cache: "no-store",
  });
  return r.json();
}

export async function listSubscribers() {
  const r = await fetch(`${URL_}?action=list&secret=${q(SECRET)}`, { cache: "no-store" });
  return r.json();
}

export async function getReferrals(code) {
  const r = await fetch(`${URL_}?action=referrals&code=${q(code)}&secret=${q(SECRET)}`, { cache: "no-store" });
  return r.json();
}