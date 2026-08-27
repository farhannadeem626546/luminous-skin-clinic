import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import TreatmentCard from "@/components/TreatmentCard";
import { concerns, reviews as fallbackReviews } from "@/data/site";
import { getCms, getReviews, getTreatments } from "@/lib/cms";
import { cloudinaryImage } from "@/lib/cloudinary";

export default async function Home() {
  const cms = await getCms();
  const treatments = await getTreatments();
  const dbReviews = await getReviews();
  const reviews = dbReviews.length ? dbReviews.map(r=>({name:String(r.client_name),treatment:String(r.treatment_name||"Client"),quote:String(r.review_text)})) : fallbackReviews;
  const hero = cloudinaryImage("luminous-skin-clinic/homepage/hero", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=90", 1600);
  const practitioner = cloudinaryImage("luminous-skin-clinic/practitioners/main-practitioner", "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=85", 900);
  return <>
    <section className="home-hero">
      <div className="hero-photo"><Image src={hero} alt="Professional facial treatment at Luminous Skin Clinic" fill priority sizes="100vw" /></div>
      <div className="hero-overlay"></div>
      <div className="container hero-content"><span className="eyebrow light">{cms["home.eyebrow"]}</span><h1>{cms["home.title"]}</h1><p>{cms["home.intro"]}</p>{cms["home.offer"]&&<strong className="hero-offer">{cms["home.offer"]}</strong>}<div className="hero-actions"><Link href="/booking" className="button light-button">Book Appointment</Link><Link href="/skin-concerns" className="button ghost-light">Find My Treatment</Link></div><div className="hero-proof"><span>★★★★★</span><small>Trusted client experience · Accessible care</small></div></div>
    </section>

    <section className="trust-strip"><div className="container trust-grid"><div><b>01</b><span>Personalised Treatments</span></div><div><b>02</b><span>Leeds Based</span></div><div><b>03</b><span>Professional Care</span></div><div><b>04</b><span>Accessible Pricing</span></div></div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="Start with your skin" title="What would you like help with?" text="You do not need to know the treatment name. Start with your concern and we’ll show you relevant options."/><div className="concern-grid">{concerns.map((c,i)=><Link href={`/skin-concerns/${c.slug}`} className="concern-card" key={c.slug}><span>0{i+1}</span><h3>{c.name}</h3><p>{c.text}</p><b>Explore options →</b></Link>)}</div></div></section>

    <section className="section soft"><div className="container"><div className="title-row"><SectionTitle eyebrow="Popular appointments" title="Skin care made easier to choose" text="Clear treatment information, transparent starting prices and a simple route to booking."/><Link href="/treatments" className="text-link desktop-link">View all treatments →</Link></div><div className="treatment-grid">{treatments.slice(0,4).map(t=><TreatmentCard key={t.slug} treatment={t}/>)}</div></div></section>

    <section className="split-section"><div className="split-image"><Image src={practitioner} alt="Luminous Skin Clinic practitioner" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="split-copy"><span className="eyebrow">Personal care matters</span><h2>{cms["about.title"]}</h2><p>{cms["about.text"]}</p><div className="feature-list"><div><b>01</b><span><strong>One-to-one attention</strong><small>Your appointment is focused on you.</small></span></div><div><b>02</b><span><strong>Clear recommendations</strong><small>Understand why a treatment may suit your goal.</small></span></div><div><b>03</b><span><strong>Comfort-first experience</strong><small>Professional care without an intimidating clinic feel.</small></span></div></div><Link href="/about" className="button primary">Our approach</Link></div></section>

    <section className="section dark"><div className="container"><SectionTitle center eyebrow="Client experience" title="Results feel better when the journey feels personal." text="Use verified client reviews and consented before/after imagery here when the clinic supplies its final assets."/><div className="review-grid">{reviews.map(r=><blockquote key={r.name}><div className="stars">★★★★★</div><p>“{r.quote}”</p><footer><strong>{r.name}</strong><span>{r.treatment}</span></footer></blockquote>)}</div><div className="center-actions"><Link href="/reviews" className="button ghost-light">Read client stories</Link><Link href="/booking" className="button light-button">Book your appointment</Link></div></div></section>

    <section className="section"><div className="container finder-banner"><div><span className="eyebrow">Not sure what to book?</span><h2>Start with your concern, not the treatment menu.</h2><p>Explore skin concerns and see which treatments may be relevant before choosing your appointment.</p></div><Link href="/skin-concerns" className="button primary">Find My Treatment</Link></div></section>
  </>;
}
