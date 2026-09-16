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
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}><Header logoUrl={logoUrl}/><main>{children}</main><Footer logoUrl={logoUrl}/><a href="/booking" className="mobile-book-bar">Book Appointment</a></body></html>;
}
