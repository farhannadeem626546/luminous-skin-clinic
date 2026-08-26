import PageHero from "@/components/PageHero";
import { reviews } from "@/data/site";
export const metadata={title:"Reviews"};
export default function Reviews(){return <><PageHero eyebrow="Client stories" title="Trust is built through the experience." text="Use verified customer feedback throughout the decision journey, not only on one testimonials page."/><section className="section dark"><div className="container review-grid">{reviews.map(r=><blockquote key={r.name}><div className="stars">★★★★★</div><p>“{r.quote}”</p><footer><strong>{r.name}</strong><span>{r.treatment}</span></footer></blockquote>)}</div></section></>}
