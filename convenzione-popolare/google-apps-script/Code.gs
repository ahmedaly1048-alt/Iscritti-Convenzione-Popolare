// Google Sheet -> Extensions -> Apps Script -> paste this file.
// Then Deploy -> New deployment -> Web app -> Execute as: Me, Who has access: Anyone.
const SECRET = "change-me-long-random-string"; // must equal SHEETS_SECRET in Vercel
const SHEET = "Iscritti";
const HEADERS = ["Data", "Nome e Cognome", "WhatsApp/Email", "CAP/Provincia", "Codice", "Invitato da", "Consenso", "Testo consenso"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
const json_ = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.secret !== SECRET) return json_({ ok: false, error: "forbidden" });
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_();
    const rows = sh.getDataRange().getValues();
    const norm = (s) => String(s).toLowerCase().replace(/[\s().-]/g, "");
    for (let i = 1; i < rows.length; i++) {
      if (norm(rows[i][2]) === norm(d.contact)) return json_({ ok: true, code: rows[i][4], duplicate: true });
    }
    // Prefix with ' so numbers like +39... are stored as text
    sh.appendRow([new Date(), d.name, "'" + d.contact, "'" + d.area, d.code, d.ref || "", d.consent ? "SI" : "NO", d.consentText]);
    return json_({ ok: true, code: d.code });
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  if (e.parameter.secret !== SECRET) return json_({ ok: false, error: "forbidden" });
  const sh = sheet_();
  if (e.parameter.action === "count") return json_({ ok: true, count: Math.max(0, sh.getLastRow() - 1) });
  if (e.parameter.action === "list") {
    const rows = sh.getDataRange().getValues().map((r, i) => (i === 0 ? r : r.map((c) => (c instanceof Date ? c.toISOString() : c))));
    return json_({ ok: true, rows });
  }
  return json_({ ok: false });
}
