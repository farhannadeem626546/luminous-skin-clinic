import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TreatmentCard from "@/components/TreatmentCard";
import { treatments } from "@/data/site";
import { cloudinaryImage } from "@/lib/cloudinary";

export function generateStaticParams(){ return treatments.map(t=>({slug:t.slug})); }

export default async function TreatmentDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const t=treatments.find(x=>x.slug===slug); if(!t) notFound();
  const src=cloudinaryImage(t.cloudinaryPublicId,t.fallbackImage,1400);
  const related=treatments.filter(x=>x.category===t.category && x.slug!==t.slug).slice(0,3);
  return <>
    <section className="detail-hero"><div className="container detail-grid"><div className="detail-copy"><span className="eyebrow">{t.category}</span><h1>{t.name}</h1><p>{t.short}</p><div className="detail-facts"><div><span>Starting from</span><strong>£{t.price}</strong></div><div><span>Appointment</span><strong>{t.duration} min</strong></div></div><div className="hero-actions"><Link className="button primary" href={`/booking?treatment=${t.slug}`}>Book this treatment</Link><Link className="button secondary" href="/contact">Ask a question</Link></div></div><div className="detail-image"><Image src={src} alt={t.name} fill priority sizes="(max-width:900px) 100vw, 50vw"/></div></div></section>
    <section className="section"><div className="container article-grid"><article><span className="eyebrow">Treatment overview</span><h2>A clear, comfortable treatment journey.</h2><p className="lead-copy">{t.description}</p><h3>Potential benefits</h3><ul className="tick-list">{t.benefits.map(b=><li key={b}>{b}</li>)}</ul><h3>Often chosen for</h3><div className="pill-list">{t.suitableFor.map(s=><span key={s}>{s}</span>)}</div><h3>Aftercare basics</h3><ul className="tick-list">{t.aftercare.map(a=><li key={a}>{a}</li>)}</ul><div className="notice">Treatment suitability and results vary between individuals. A consultation may be required and no treatment outcome is guaranteed.</div></article><aside className="sticky-card"><span className="eyebrow">Ready when you are</span><h3>{t.name}</h3><p>Check available appointments and choose a time that suits you.</p><div className="price-line"><span>From</span><strong>£{t.price}</strong></div><Link className="button primary full" href={`/booking?treatment=${t.slug}`}>Check availability</Link></aside></div></section>
    {related.length>0 && <section className="section soft"><div className="container"><div className="section-title"><span className="eyebrow">You may also like</span><h2>Related treatments</h2></div><div className="treatment-grid">{related.map(x=><TreatmentCard treatment={x} key={x.slug}/>)}</div></div></section>}
  </>;
}
