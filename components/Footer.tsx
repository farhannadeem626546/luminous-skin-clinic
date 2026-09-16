import Link from "next/link";

type Cms = Record<string, string>;

export default function Footer({ logoUrl="/luminous-logo-transparent.png", cms={} }: { logoUrl?: string; cms?: Cms }) {
  const socials = [
    ["Instagram", cms["global.instagram"]],
    ["TikTok", cms["global.tiktok"]],
    ["Facebook", cms["global.facebook"]],
    ["Trustpilot", cms["global.trustpilot"]],
    ["Linktree", cms["global.linktree"]]
  ].filter((item): item is [string,string] => Boolean(item[1]));
  return <footer className="footer">
    <div className="container footer-grid">
      <div><div className="brand footer-brand"><img className="brand-logo footer-logo" src={logoUrl||"/luminous-logo-transparent.png"} alt="Luminous Skin Clinic" /></div><p>Personalised skin, facial and wellness treatments designed around your goals, comfort and confidence.</p><div className="footer-socials">{socials.map(([label,url])=><a href={url} key={label} target="_blank" rel="noreferrer">{label}</a>)}</div></div>
      <div><h4>Explore</h4><Link href="/services">Services</Link><Link href="/skin-concerns">Skin Concerns</Link><Link href="/pricing">Pricing</Link><Link href="/results">Results</Link></div>
      <div><h4>Clinic</h4><Link href="/about">About</Link><Link href="/reviews">Reviews</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></div>
      <div><h4>Contact</h4><p>{cms["contact.location"]||"Leeds, United Kingdom"}</p>{cms["contact.phone"]&&<a href={`tel:${cms["contact.phone"].replace(/\s/g,"")}`}>{cms["contact.phone"]}</a>}{cms["contact.whatsapp"]&&<a href="https://wa.me/447950774790" target="_blank" rel="noreferrer">WhatsApp us</a>}<Link className="text-link" href="/booking">Check availability →</Link></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Luminous Skin Clinic</span><span>Privacy · Booking Policy · Cookies</span></div>
  </footer>;
}
