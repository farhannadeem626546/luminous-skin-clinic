import Link from "next/link";
import PageHero from "@/components/PageHero";
import { concerns } from "@/data/site";
export const metadata={title:"Skin Concerns"};
export default function Concerns(){return <><PageHero eyebrow="Find your route" title="Start with what you want to improve." text="You do not need to diagnose your own skin or guess a treatment. Explore common concerns and see suitable next steps."/><section className="section"><div className="container concern-grid large">{concerns.map((c,i)=><Link href={`/skin-concerns/${c.slug}`} className="concern-card" key={c.slug}><span>0{i+1}</span><h3>{c.name}</h3><p>{c.text}</p><b>See treatment options →</b></Link>)}</div></section></>}
