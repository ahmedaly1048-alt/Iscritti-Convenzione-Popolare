import "./globals.css";
import { Archivo_Black, Inter } from "next/font/google";
import InAppHint from "./components/InAppHint";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(site),
  title: "Più siamo, meno paghiamo | Iniziativa nazionale contro il caro vita",
  description:
    "Unisciti al primo gruppo d'acquisto popolare. Gratis, senza vincoli: sconti reali su servizi indispensabili per le famiglie.",
  other: { google: "notranslate" },
  openGraph: {
    title: "Più siamo, meno paghiamo.",
    description: "Iscriviti gratis al gruppo d'acquisto popolare contro il caro vita.",
    type: "website",
    locale: "it_IT",
    // images: ["/og.png"],  // add a 1200x630 image in /public and uncomment
  },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b2545" };

export default function RootLayout({ children }) {
  return (
    <html lang="it" translate="no" className={`${display.variable} ${body.variable}`}>
      <body>
        <InAppHint />
        {children}
      </body>
    </html>
  );
}