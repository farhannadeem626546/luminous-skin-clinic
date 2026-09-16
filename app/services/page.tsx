import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getServiceCategories, getTreatments } from "@/lib/cms";

export const metadata={title:"Services",description:"Explore clinic facials, massage therapy and facial skin treatments at Luminous Skin Clinic."};

const fallbackImages:Record<string,string>={
  "clinic-facials":"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85",
  "massage-therapy":"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
  "facial-skin-treatments":"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=85"
};

export default async function ServicesPage(){
  const[categories,treatments]=await Promise.all([getServiceCategories(),getTreatments()]);
  return <><PageHero eyebrow="Luminous service menu" title="Choose the care that feels right for you." text="Browse each service collection separately, see transparent prices and book online."/><section className="section service-directory"><div className="container service-category-grid">{categories.map(category=>{const count=treatments.filter(t=>t.category===category.name).length;const media=category.image_url||fallbackImages[category.slug];return <article className="service-category-card" key={category.slug}><div className="service-category-media">{category.video_url?<video src={category.video_url} muted loop autoPlay playsInline preload="metadata"/>:<Image src={media} alt={category.name} fill sizes="(max-width: 850px) 100vw, 33vw"/>}</div><div className="service-category-copy"><span>{String(count).padStart(2,"0")} services</span><h2>{category.name}</h2><p>{category.description}</p><Link className="button primary" href={`/services/${category.slug}`}>View services</Link></div></article>})}</div></section></>;
}
