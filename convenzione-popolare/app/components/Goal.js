"use client";
import { useEffect, useRef, useState } from "react";

// Progress card: bar fills and the number counts up when it scrolls into view.
export default function Goal({ count, goal, pct }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  const [n, setN] = useState(0);
  const fmt = (v) => v.toLocaleString("it-IT");

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (reduce) { setP(pct); setN(count); return; }
      const t0 = performance.now(), D = 1600;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
        setP(pct * e); setN(Math.round(count * e));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [count, pct]);

  return (
    <div className="goal" ref={ref}>
      <h3>Obiettivo: {fmt(goal)} iscritti</h3>
      <p className="count">{fmt(n)} iscritti ({Math.round(p)}% raggiunto)</p>
      <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${p > 0 ? Math.max(p, 2) : 0}%` }} />
      </div>
      <p>Al raggiungimento dei {fmt(goal)} iscritti sbloccheremo nuove maxi-convenzioni.</p>
    </div>
  );
}