import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getCms } from "@/lib/cms";
export const dynamic="force-dynamic";export const metadata={title:"Contact"};
export default async function Contact(){const c=await getCms();return <><PageHero eyebrow="Contact the clinic" title="Have a question before you book?" text="Send an enquiry or use the booking page to choose a treatment and appointment."/><section className="section"><div className="container contact-grid"><div><span className="eyebrow">Clinic details</span><h2>Luminous Skin Clinic</h2><p>{c["contact.location"]}</p><div className="contact-cards"><div><span>Email</span><strong>{c["contact.email"]||"Update in admin"}</strong></div><div><span>Phone</span><strong>{c["contact.phone"]||"Update in admin"}</strong></div><div><span>WhatsApp</span><strong>{c["contact.whatsapp"]||"Update in admin"}</strong></div></div></div><ContactForm/></div></section></>}
