// Turns raw sheet rows into clean contact objects (works for old and new rows).
export function parseRows(rows) {
  return rows
    .slice(1)
    .filter((r) => r[1] || r[2])
    .map((r, i) => {
      const raw = String(r[2] ?? "").trim();
      const isMail = raw.includes("@");
      const [fn, ...rest] = String(r[1] ?? "").trim().split(/\s+/);
      const lat = parseFloat(r[12]);
      const lng = parseFloat(r[13]);
      const area = String(r[3] ?? "").trim();
      return {
        id: i,
        date: String(r[0] || ""),
        first: String(r[8] || fn || "").trim(),
        last: String(r[9] || rest.join(" ")).trim(),
        email: String(r[10] || (isMail ? raw : "")).trim(),
        phone: String(r[11] || (isMail ? "" : raw)).trim(),
        area,
        city: String(r[14] || area).trim(),
        lat: isFinite(lat) ? lat : null,
        lng: isFinite(lng) ? lng : null,
        code: String(r[4] || ""),
        ref: String(r[5] || ""),
      };
    })
    .reverse(); // newest first
}