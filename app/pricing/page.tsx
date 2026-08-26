import Link from "next/link";
import PageHero from "@/components/PageHero";
import { treatments } from "@/data/site";
export const metadata={title:"Pricing"};
export default function Pricing(){return <><PageHero eyebrow="Transparent pricing" title="Know the starting price before you book." text="Simple, accessible pricing with treatment details available before you choose your appointment."/><section className="section"><div className="container narrow-wide"><div className="price-table">{treatments.map(t=><div className="price-row" key={t.slug}><div><span>{t.category}</span><h3>{t.name}</h3><small>{t.duration} minutes</small></div><strong>From £{t.price}</strong><Link href={`/booking?treatment=${t.slug}`}>Book →</Link></div>)}</div><p className="muted center-text">Prices are starting prices and may change based on treatment requirements. Confirm final pricing with the clinic where relevant.</p></div></section></>}
