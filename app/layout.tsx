import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCms } from "@/lib/cms";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Luminous Skin Clinic Leeds", template: "%s | Luminous Skin Clinic" },
  description: "Personalised skin, facial and wellness treatments in Leeds. Explore treatments, skin concerns, pricing and online booking.",
  metadataBase: new URL("https://luminous-skin-clinic.vercel.app")
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cms=await getCms(); const logoUrl=cms["global.logo_url"]||"/luminous-logo.png";
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}><Header logoUrl={logoUrl}/><main>{children}</main><Footer logoUrl={logoUrl} cms={cms}/><a className="whatsapp-float" href="https://wa.me/447950774790" target="_blank" rel="noreferrer" aria-label="Chat with Luminous Skin Clinic on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11.1 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-2-.8-3.4-1.8-4.5-3.8-.3-.5.3-.5.8-1.6.1-.2 0-.5 0-.7l-1-2.4c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.6.1-.9.5s-1.2 1.2-1.2 2.9 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.1 2.2 1 3.1 1 4.2.8 1.3-.2 1.9-1.2 2.2-1.7.3-.5.3-1 .2-1.1-.2-.3-.4-.4-.7-.5Z"/></svg><span>WhatsApp</span></a><a href="/booking" className="mobile-book-bar">Book Appointment</a></body></html>;
}
