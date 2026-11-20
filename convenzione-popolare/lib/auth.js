import crypto from "crypto";

export const COOKIE = "cp_admin";

export const token = () =>
  crypto.createHmac("sha256", process.env.ADMIN_KEY || "x").update("cp-admin-v1").digest("hex");

export function isAdmin(jar) {
  if (!process.env.ADMIN_KEY) return false;
  const v = jar.get(COOKIE)?.value || "";
  const t = token();
  return v.length === t.length && crypto.timingSafeEqual(Buffer.from(v), Buffer.from(t));
}