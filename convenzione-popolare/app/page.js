import Link from "next/link";
import { getCount } from "@/lib/sheets";
import Reveal from "./components/Reveal";
import Goal from "./components/Goal";
import { ShareBox, StickyCta } from "./components/Share";

export const revalidate = 60;

const BENEFITS = [
  { t: "100% Gratuita", d: "Nessun abbonamento, nessun vincolo." },
  { t: "Tutela e forza collettiva", d: "Più cresce la community, maggiore è il nostro potere di trattativa." },
  {
    t: "Sconti reali dal 5% al 40%",
    d: "Uno staff lavorerà ogni giorno per ottenere le migliori offerte con i migliori servizi e le primarie aziende italiane.",
  },
];

export default async function Home({ searchParams }) {
  const goal = Number(process.env.NEXT_PUBLIC_GOAL || 10000);
  const count = await getCount();
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const ref = typeof searchParams?.ref === "string" ? searchParams.ref : "";
  const href = ref ? `/iscriviti?ref=${encodeURIComponent(ref)}` : "/iscriviti";

  return (
    <main className="landing">
      <p className="kicker">
        <span>Iniziativa popolare</span>
      </p>

      <section className="hero">
        <div className="hero-inner">
          <h1>
            <span className="l1">Più siamo,</span>
            <em>meno paghiamo.</em>
          </h1>
          <div className="badge" aria-hidden="true">
            <span>Convenzione<br />Popolare</span>
          </div>
          <p className="lead">
            Unisciti al primo gruppo d&apos;acquisto popolare. Sfruttiamo la forza dei numeri per ottenere
            sconti reali su servizi indispensabili per le famiglie.
          </p>
        </div>
      </section>

      <section className="wrap">
        <Reveal><h2>Cosa ottieni iscrivendoti oggi</h2></Reveal>
        <ol className="benefits">
          {BENEFITS.map((b, i) => (
            <Reveal as="li" key={b.t} delay={i * 120}>
              <div className="card">
                <h3>{i + 1}. {b.t}</h3>
                <p>{b.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal><ShareBox /></Reveal>

        <Reveal><Goal count={count} goal={goal} pct={pct} /></Reveal>

        <p className="foot"><Link href="/privacy">Informativa privacy</Link></p>
      </section>

      {/* Always visible at the bottom of the screen */}
      <div className="sticky">
        <StickyCta href={href} />
      </div>
    </main>
  );
}