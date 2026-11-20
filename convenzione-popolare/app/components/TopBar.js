export default function TopBar({ count, goal }) {
  const pct = Math.min(100, (count / goal) * 100);
  const fmt = (n) => n.toLocaleString("it-IT");
  return (
    <div className="topbar">
      <div className="tb-in">
        <p className="tb-msg">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>
            Obiettivo {fmt(goal)} iscritti:{" "}
            {count > 0 ? (
              <>siamo già a <b>{fmt(count)}</b> {count === 1 ? "famiglia unita" : "famiglie unite"}!</>
            ) : (
              "unisciti tra i primi soci fondatori!"
            )}
          </span>
        </p>
        <div className="tb-bar"><i style={{ width: `${Math.max(pct, 1.5)}%` }} /></div>
        <p className="tb-pct">{pct.toFixed(1).replace(".", ",")}% dell&apos;obiettivo</p>
      </div>
    </div>
  );
}