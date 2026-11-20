"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveCode } from "./Share";

export default function SignupForm() {
  const router = useRouter();
  const [invite, setInvite] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) setInvite(r.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.get("firstName"),
          lastName: f.get("lastName"),
          area: f.get("area"),
          contact: f.get("contact"),
          website: f.get("website"), // honeypot
          consent: f.get("consent") === "on",
          ref: invite,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Errore");
      saveCode(j.code);
      setStatus("done");
      router.push("/"); // back to the home page, where the share card is waiting
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <section>
      <Link href="/" className="back">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Indietro</span>
      </Link>

      <h1>Aderisci in 5 secondi</h1>
      <p className="sub">È gratuito. Diventi subito <b>Socio Fondatore</b>.</p>

      <form onSubmit={onSubmit}>
        <label className="field">
          <span>Nome</span>
          <input name="firstName" autoComplete="given-name" autoCapitalize="words" required minLength={2} />
        </label>
        <label className="field">
          <span>Cognome</span>
          <input name="lastName" autoComplete="family-name" autoCapitalize="words" required minLength={2} />
        </label>
        <label className="field">
          <span>Città o CAP</span>
          <input name="area" placeholder="Es. Roma oppure 00184" autoComplete="postal-code" required />
        </label>
        <label className="field">
          <span>Numero di WhatsApp (o email)</span>
          <small>Ti scriveremo solo per le novità importanti.</small>
          <input name="contact" placeholder="Es. 333 123 4567" autoComplete="email tel" required />
        </label>
        <label className="field">
          <span>Codice invito di un amico</span>
          <small>Facoltativo. Se un amico ti ha invitato, il codice è già inserito.</small>
          <input
            className="code-in"
            placeholder="ABC123"
            value={invite}
            maxLength={12}
            onChange={(e) => setInvite(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          />
        </label>

        {/* Honeypot, hidden from humans */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

        {/* PRIVACY: must stay in this spot, between the fields and the button */}
        <label className="consent">
          <input type="checkbox" name="consent" required />
          <span className="dot" aria-hidden="true" />
          <span>
            Acconsento al trattamento dei miei dati per partecipare alla Convenzione Popolare e ricevere
            novità e convenzioni via email o WhatsApp. I miei dati non verranno venduti. Se mi ha invitato
            un amico, potrà vedere il mio nome e l&apos;iniziale del cognome.{" "}
            <Link href="/privacy" target="_blank">Informativa privacy</Link>
          </span>
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button className="cta cta-orange" disabled={status !== "idle"}>
          {status === "idle" && <span>CONFERMA ADESIONE</span>}
          {status === "sending" && (
            <>
              <span className="spin" />
              <span>Invio in corso…</span>
            </>
          )}
          {status === "done" && <span>Adesione confermata ✓</span>}
        </button>
        <p className="safe">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>I tuoi dati sono al sicuro</span>
        </p>
      </form>
    </section>
  );
}