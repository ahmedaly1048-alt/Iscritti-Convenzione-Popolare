"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const KEY = "cp_code";
const TEXT = "Più siamo, meno paghiamo: iscriviti gratis al gruppo d'acquisto popolare contro il caro vita.";

export function saveCode(code) {
  try {
    localStorage.setItem(KEY, code);
    sessionStorage.setItem("cp_new", "1"); // tells the home page to show the welcome message
  } catch {}
}
function clearCode() {
  try { localStorage.removeItem(KEY); } catch {}
}
function useMyCode() {
  const [code, setCode] = useState("");
  useEffect(() => {
    try { setCode(localStorage.getItem(KEY) || ""); } catch {}
  }, []);
  return code;
}

const linkFor = (code) => `${window.location.origin}/${code ? `?ref=${code}` : ""}`;

async function nativeShare(url) {
  if (!navigator.share) return false;
  try { await navigator.share({ title: "Convenzione Popolare", text: TEXT, url }); } catch {}
  return true;
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch { window.prompt("Copia questo link:", t); return false; }
}

/* ---------- Share panel: link + copy, WhatsApp, other apps ---------- */
export function SharePanel({ code }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(linkFor(code)), [code]);

  const copy = async () => {
    if (await copyText(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const more = async () => { if (!(await nativeShare(url))) copy(); };

  return (
    <div className="sp">
      <div className="sp-link">
        <span className="sp-url">{url.replace(/^https?:\/\//, "")}</span>
        <button type="button" className="sp-copy" onClick={copy}>
          <span>{copied ? "Copiato ✓" : "Copia"}</span>
        </button>
      </div>
      <div className="sp-row">
        <a
          className="btn btn-wa"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://wa.me/?text=${encodeURIComponent(`${TEXT} ${url}`)}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z" />
          </svg>
          <span>WhatsApp</span>
        </a>
        <button type="button" className="btn btn-ghost" onClick={more}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          <span>Altre app</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Friends who joined thanks to this code ---------- */
export function Referrals({ code }) {
  const [data, setData] = useState(null);
  const load = useCallback(async () => {
    if (document.hidden) return;
    try {
      const r = await fetch(`/api/referrals?code=${code}`, { cache: "no-store" });
      setData(await r.json());
    } catch {}
  }, [code]);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const n = data?.count ?? 0;
  return (
    <div className="refs">
      <div className="refs-head">
        <strong className="refs-n">{n}</strong>
        <span>{n === 1 ? "amico si è iscritto grazie a te" : "amici si sono iscritti grazie a te"}</span>
      </div>
      {n > 0 ? (
        <ul>
          {data.friends.map((f, i) => (
            <li key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <i>{f.name[0]}</i>
              <span>{f.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="refs-empty">
          Appena un amico si iscrive con il tuo link, compare qui con il suo nome.
        </p>
      )}
    </div>
  );
}

/* ---------- Member card: share + friends ---------- */
export function MemberCard({ code, showLeave = false, welcome = false }) {
  const leave = () => { clearCode(); window.location.reload(); };
  return (
    <section className="member">
      {welcome && (
        <p className="m-welcome" role="status">
          <span>✓ Adesione confermata! Ora passa parola ai tuoi amici.</span>
        </p>
      )}
      <div className="m-head">
        <span className="m-badge">Passa parola</span>
        <h3>Fai crescere il gruppo</h3>
        <p>Condividi il tuo link personale: ogni amico che si iscrive ci rende più forti.</p>
      </div>
      <SharePanel code={code} />
      <Referrals code={code} />
      <p className="m-foot">
        <span>Il tuo codice invito:</span> <b>{code}</b>
        {showLeave && (
          <>
            {" · "}
            <button type="button" className="linkbtn" onClick={leave}><span>Non sei tu?</span></button>
          </>
        )}
      </p>
    </section>
  );
}

/* ---------- Landing page, under the benefit cards ---------- */
export function ShareBox() {
  const code = useMyCode();
  const [msg, setMsg] = useState("");
  const [welcome, setWelcome] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("cp_new")) {
        sessionStorage.removeItem("cp_new");
        setWelcome(true);
        setTimeout(() => box.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 600);
      }
    } catch {}
  }, []);

  if (code) return <div ref={box}><MemberCard code={code} showLeave welcome={welcome} /></div>;

  const go = async () => {
    const url = linkFor("");
    if (await nativeShare(url)) return;
    if (await copyText(url)) { setMsg("Link copiato!"); setTimeout(() => setMsg(""), 2000); }
  };
  return (
    <button type="button" className="cta cta-inline" onClick={go}>
      <span>{msg || "Condividi"}</span>
      <small>Porta amici e famiglie: più siamo, più otteniamo</small>
    </button>
  );
}

/* ---------- Fixed bottom button ---------- */
export function StickyCta({ href }) {
  const code = useMyCode();
  const [msg, setMsg] = useState("");

  if (!code)
    return (
      <Link href={href} className="cta pulse">
        <span>Aderisci gratis ora</span>
        <small>Iscrizione immediata senza impegno</small>
      </Link>
    );

  const go = async () => {
    const url = linkFor(code);
    if (await nativeShare(url)) return;
    if (await copyText(url)) { setMsg("Link copiato!"); setTimeout(() => setMsg(""), 2000); }
  };
  return (
    <button type="button" className="cta pulse" onClick={go}>
      <span>{msg || "Condividi con i tuoi amici"}</span>
      <small>Ogni iscritto in più ci rende più forti</small>
    </button>
  );
}