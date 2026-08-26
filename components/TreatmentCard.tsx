import Image from "next/image";
import Link from "next/link";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { Treatment } from "@/data/site";

export default function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const src = cloudinaryImage(treatment.cloudinaryPublicId, treatment.fallbackImage, 800);
  return <article className="treatment-card">
    <div className="card-image"><Image src={src} alt={treatment.name} fill sizes="(max-width: 768px) 100vw, 33vw" /></div>
    <div className="card-body"><span className="card-category">{treatment.category}</span><h3>{treatment.name}</h3><p>{treatment.short}</p>
      <div className="card-meta"><span>From £{treatment.price}</span><span>{treatment.duration} min</span></div>
      <div className="card-actions"><Link href={`/treatments/${treatment.slug}`} className="text-link">Learn more →</Link><Link href={`/booking?treatment=${treatment.slug}`} className="mini-button">Book</Link></div>
    </div>
  </article>;
}
