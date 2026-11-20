import { cookies } from "next/headers";
import { listSubscribers } from "@/lib/sheets";
import { parseRows } from "@/lib/contacts";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "../components/AdminLogin";
import Dashboard from "../components/Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Convenzione Popolare", robots: { index: false, follow: false } };

export default async function Admin() {
  if (!isAdmin(cookies())) return <AdminLogin />;
  let contacts = [];
  let error = "";
  try {
    const d = await listSubscribers();
    if (!d.ok) throw new Error("bad");
    contacts = parseRows(d.rows);
  } catch {
    error = "Impossibile leggere il foglio Google. Controlla SHEETS_WEBHOOK_URL e SHEETS_SECRET.";
  }
  return <Dashboard contacts={contacts} error={error} />;
}