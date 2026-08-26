"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Treatments", "/treatments"],
  ["Skin Concerns", "/skin-concerns"],
  ["Results", "/results"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Reviews", "/reviews"],
  ["FAQ", "/faq"]
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">L</span>
          <span><strong>Luminous</strong><small>Skin Clinic · Leeds</small></span>
        </Link>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
        <nav className={open ? "main-nav open" : "main-nav"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="nav-book" href="/booking" onClick={() => setOpen(false)}>Book Now</Link>
        </nav>
      </div>
    </header>
  );
}
