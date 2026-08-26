import PageHero from "@/components/PageHero";
import TreatmentCard from "@/components/TreatmentCard";
import { treatments } from "@/data/site";

export const metadata = { title: "Treatments" };

export default function TreatmentsPage(){
  const groups = Array.from(new Set(treatments.map(t=>t.category)));
  return <><PageHero eyebrow="Treatment menu" title="Professional treatments, explained clearly." text="Explore skin, facial and wellness appointments with transparent starting prices and easy online booking."/>
  {groups.map(group=><section className="section" key={group}><div className="container"><div className="section-title"><span className="eyebrow">{group}</span><h2>{group}</h2></div><div className="treatment-grid">{treatments.filter(t=>t.category===group).map(t=><TreatmentCard key={t.slug} treatment={t}/>)}</div></div></section>)}</>;
}
