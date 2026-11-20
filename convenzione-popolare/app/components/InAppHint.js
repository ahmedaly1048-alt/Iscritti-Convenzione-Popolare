"use client";
import { useEffect, useState } from "react";

// TikTok / Instagram / Facebook in-app browsers often break forms or flag links.
// This only shows a hint; it cannot unblock a link flagged by TikTok itself.
export default function InAppHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(/TikTok|musical_ly|BytedanceWebview|Instagram|FBAN|FBAV/i.test(navigator.userAgent));
  }, []);
  if (!show) return null;
  return (
    <div className="hint" role="note">
      Se qualcosa non funziona, tocca ⋯ e scegli <strong>“Apri nel browser”</strong>.
    </div>
  );
}
