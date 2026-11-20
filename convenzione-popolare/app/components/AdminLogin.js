"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const key = new FormData(e.currentTarget).get("key");
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (r.ok) router.refresh();
    else { setErr((await r.json().catch(() => ({}))).error || "Errore"); setBusy(false); }
  }

  return (
    <div className="ad">
      <form className="ad-login" onSubmit={submit}>
        <h1>Area riservata</h1>
        <p className="ad-muted">Inserisci la chiave amministratore.</p>
        <input type="password" name="key" placeholder="Chiave" autoComplete="current-password" required />
        {err && <p className="error" role="alert">{err}</p>}
        <button className="ad-btn primary" disabled={busy}>{busy ? "Verifica…" : "Entra"}</button>
      </form>
    </div>
  );
}