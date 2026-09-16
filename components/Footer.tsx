import Link from "next/link";

export default function Footer({logoUrl="/luminous-logo.png"}:{logoUrl?:string}) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><img className="brand-logo footer-logo" src={logoUrl||"/luminous-logo.png"} alt="Luminous Skin Clinic" /></div>
          <p>Personalised skin, facial and wellness treatments designed around your goals, comfort and confidence.</p>
        </div>
        <div><h4>Explore</h4><Link href="/services">Services</Link><Link href="/skin-concerns">Skin Concerns</Link><Link href="/pricing">Pricing</Link><Link href="/results">Results</Link></div>
        <div><h4>Clinic</h4><Link href="/about">About</Link><Link href="/reviews">Reviews</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></div>
        <div><h4>Book</h4><p>Leeds, United Kingdom</p><p>Opening hours and exact clinic details will be connected in admin settings.</p><Link className="text-link" href="/booking">Check availability →</Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Luminous Skin Clinic</span><span>Privacy · Booking Policy · Cookies</span></div>
    </footer>
  );
}
