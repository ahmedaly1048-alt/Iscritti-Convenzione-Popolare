"use client";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const AdminMap = dynamic(() => import("./AdminMap"), {
  ssr: false,
  loading: () => <div className="ad-map ad-maploading">Caricamento mappa…</div>,
});

const fmt = (d) => {
  const t = new Date(d);
  return isNaN(t)
    ? ""
    : t.toLocaleString("it-IT", {
        timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
};

function waLink(p) {
  let d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("3") && d.length <= 10) d = "39" + d;
  return `https://wa.me/${d}`;
}

const PAGE = 200;

export default function Dashboard({ contacts, error }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sel, setSel] = useState(() => new Set());
  const [subject, setSubject] = useState("Convenzione Popolare");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState(false);

  const places = useMemo(() => {
    const m = new Map();
    contacts.forEach((c) => {
      if (c.lat == null) return;
      const k = c.city.toLowerCase();
      const p = m.get(k) || { city: c.city, lat: c.lat, lng: c.lng, count: 0 };
      p.count++;
      m.set(k, p);
    });
    return [...m.values()];
  }, [contacts]);

  const cities = useMemo(
    () => [...new Set(contacts.map((c) => c.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "it")),
    [contacts]
  );

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        (!city || c.city === city) &&
        (!s || [c.first, c.last, c.email, c.phone, c.city].join(" ").toLowerCase().includes(s))
    );
  }, [contacts, q, city]);

  const week = Date.now() - 7 * 864e5;
  const stats = {
    total: contacts.length,
    week: contacts.filter((c) => new Date(c.date).getTime() > week).length,
    cities: cities.length,
    emails: contacts.filter((c) => c.email).length,
  };
  const noPos = contacts.filter((c) => c.lat == null).length;

  const emails = useMemo(
    () => [...new Set(contacts.filter((c) => sel.has(c.id) && c.email).map((c) => c.email))],
    [contacts, sel]
  );
  const mailto = `mailto:?bcc=${emails.join(",")}&subject=${encodeURIComponent(subject)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails.join(",")}&su=${encodeURIComponent(subject)}`;
  const mailtoOk = emails.length > 0 && mailto.length <= 1800;

  const toggle = (id) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allSel = list.length > 0 && list.every((c) => sel.has(c.id));
  const toggleAll = () =>
    setSel((s) => {
      const n = new Set(s);
      list.forEach((c) => (allSel ? n.delete(c.id) : n.add(c.id)));
      return n;
    });

  const pick = useCallback((c) => { setCity(c); setLimit(PAGE); }, []);

  async function copy() {
    const t = emails.join(", ");
    try { await navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt("Copia:", t); }
  }
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="ad">
      <header className="ad-top">
        <h1>Iscritti · Convenzione Popolare</h1>
        <button className="ad-btn" onClick={() => router.refresh()}>Aggiorna</button>
        <a className="ad-btn" href="/api/export">Scarica CSV</a>
        <button className="ad-btn" onClick={logout}>Esci</button>
      </header>

      <main className="ad-wrap">
        {error && <p className="error">{error}</p>}

        <div className="ad-stats">
          <div className="ad-stat"><b>{stats.total}</b><span>Iscritti totali</span></div>
          <div className="ad-stat"><b>{stats.week}</b><span>Ultimi 7 giorni</span></div>
          <div className="ad-stat"><b>{stats.cities}</b><span>Città / zone</span></div>
          <div className="ad-stat"><b>{stats.emails}</b><span>Con email</span></div>
        </div>

        <section className="ad-card">
          <h2>Dove si sono iscritti</h2>
          <AdminMap places={places} onPick={pick} />
          <p className="ad-muted">
            Clicca un cerchio per filtrare l&apos;elenco su quella città.
            {noPos > 0 && ` ${noPos} iscritti senza posizione (luogo non riconosciuto).`}
          </p>
        </section>

        <section className="ad-card">
          <h2>Elenco iscritti ({list.length})</h2>

          <div className="ad-tools">
            <input type="search" placeholder="Cerca nome, email, telefono, città…" value={q}
              onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} />
            <select value={city} onChange={(e) => { setCity(e.target.value); setLimit(PAGE); }}>
              <option value="">Tutte le città</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {(q || city) && (
              <button className="ad-btn" onClick={() => { setQ(""); setCity(""); }}>Azzera filtri</button>
            )}
          </div>

          <div className="ad-bulk">
            <strong>{emails.length} email selezionate</strong>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Oggetto" aria-label="Oggetto" />
            <a className="ad-btn primary" href={mailtoOk ? mailto : undefined} aria-disabled={!mailtoOk}>Scrivi email</a>
            <a className="ad-btn" href={emails.length ? gmail : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!emails.length}>Apri in Gmail</a>
            <button className="ad-btn" onClick={copy} disabled={!emails.length}>{copied ? "Copiato ✓" : "Copia email"}</button>
            {sel.size > 0 && <button className="ad-btn" onClick={() => setSel(new Set())}>Deseleziona</button>}
            {emails.length > 0 && !mailtoOk && (
              <span className="ad-muted">Troppi destinatari per il link diretto: usa Gmail o Copia email.</span>
            )}
          </div>

          <div className="ad-tablewrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" checked={allSel} onChange={toggleAll} aria-label="Seleziona tutti" /></th>
                  <th>Nome</th><th>Cognome</th><th>Data</th><th>Città</th><th>Email</th><th>Telefono</th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, limit).map((c) => (
                  <tr key={c.id} className={sel.has(c.id) ? "on" : ""}>
                    <td><input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} aria-label={`Seleziona ${c.first} ${c.last}`} /></td>
                    <td>{c.first}</td>
                    <td>{c.last}</td>
                    <td>{fmt(c.date)}</td>
                    <td>{c.city}</td>
                    <td>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : "—"}</td>
                    <td>
                      {c.phone ? (
                        <>
                          <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
                          <a className="ad-wa" href={waLink(c.phone)} target="_blank" rel="noopener noreferrer" title="Apri in WhatsApp">WA</a>
                        </>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={7} className="ad-muted">Nessun iscritto trovato.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {list.length > limit && (
            <p><button className="ad-btn" onClick={() => setLimit((l) => l + PAGE)}>Mostra altri {PAGE}</button></p>
          )}
        </section>
      </main>
    </div>
  );
}