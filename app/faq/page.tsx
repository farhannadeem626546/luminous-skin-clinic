import PageHero from "@/components/PageHero";
import { faqs } from "@/data/site";
export const metadata={title:"FAQ"};
export default function FAQ(){return <><PageHero eyebrow="Questions answered" title="Everything you need before booking." text="Clear answers reduce uncertainty and help clients arrive prepared."/><section className="section"><div className="container narrow-wide faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section></>}
