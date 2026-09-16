import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceCategories, getTreatments } from "@/lib/cms";

export const dynamic="force-dynamic";

const fallbackImages:Record<string,string>={
  "clinic-facials":"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=85",
  "massage-therapy":"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85",
  "facial-skin-treatments":"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=85"
};

export default async function ServiceCategoryPage({params}:{params:Promise<{slug:string}>}){
  const{slug}=await params;const[categories,treatments]=await Promise.all([getServiceCategories(),getTreatments()]);const category=categories.find(item=>item.slug===slug);if(!category)notFound();const services=treatments.filter(item=>item.category===category.name);const media=category.image_url||fallbackImages[category.slug];
  return <><section className="service-hero"><div className="service-hero-media">{category.video_url?<video src={category.video_url} muted loop autoPlay playsInline preload="metadata"/>:<Image src={media} alt={category.name} fill priority sizes="100vw"/>}</div><div className="service-hero-shade"/><div className="container service-hero-copy"><Link href="/services" className="service-back">← All services</Link><span className="eyebrow light">Luminous Skin Clinic</span><h1>{category.name}</h1><p>{category.description}</p></div></section><section className="section service-list-section"><div className="container narrow-wide"><div className="service-list-heading"><div><span className="eyebrow">Treatment menu</span><h2>{category.name}</h2></div><p>{services.length} appointments available</p></div><div className="service-list">{services.map(service=><article className="service-row" key={service.slug}><div className="service-thumb">{service.videoUrl?<video src={service.videoUrl} muted loop playsInline autoPlay preload="metadata"/>:<Image src={service.fallbackImage} alt={service.name} fill sizes="96px"/>}</div><div className="service-row-copy"><span>{service.duration} minutes</span><h3>{service.name}</h3><p>{service.short}</p></div><strong>£{service.price}</strong><div className="service-row-actions"><Link href={`/treatments/${service.slug}`} className="text-link">Details</Link><Link href={`/booking?treatment=${service.slug}`} className="service-book-button">Book now</Link></div></article>)}</div>{!services.length&&<div className="empty-state"><h2>Services are being prepared.</h2><p>Add or assign services to this category from the admin dashboard.</p></div>}</div></section></>;
}
