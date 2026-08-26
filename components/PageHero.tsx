import Link from "next/link";

export default function PageHero({ eyebrow, title, text, cta = true }: { eyebrow: string; title: string; text: string; cta?: boolean }) {
  return <section className="page-hero"><div className="container narrow"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p>{cta && <div className="hero-actions"><Link className="button primary" href="/booking">Book an appointment</Link><Link className="button secondary" href="/treatments">Explore treatments</Link></div>}</div></section>;
}
