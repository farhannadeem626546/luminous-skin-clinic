"use client";

import { useMemo, useState } from "react";
import { treatments } from "@/data/site";

type Step = 1 | 2 | 3 | 4 | 5;

const dates = ["Mon 7 Sep", "Tue 8 Sep", "Thu 10 Sep", "Fri 11 Sep", "Sat 12 Sep"];
const times = ["10:00 AM", "10:45 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:15 PM"];

export default function BookingWizard({ initialSlug }: { initialSlug?: string }) {
  const initial = treatments.find(t => t.slug === initialSlug)?.slug || treatments[0].slug;
  const [step, setStep] = useState<Step>(1);
  const [treatmentSlug, setTreatmentSlug] = useState(initial);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const selected = useMemo(() => treatments.find(t => t.slug === treatmentSlug)!, [treatmentSlug]);

  const next = () => setStep(Math.min(5, step + 1) as Step);
  const back = () => setStep(Math.max(1, step - 1) as Step);

  return <div className="booking-shell">
    <div className="booking-progress">{[1,2,3,4,5].map(n => <span key={n} className={step >= n ? "active" : ""}>{n}</span>)}</div>
    <div className="booking-layout">
      <div className="booking-main">
        {step === 1 && <div><span className="eyebrow">Step 1 of 5</span><h2>Choose your treatment</h2><div className="choice-list">{treatments.map(t => <button key={t.slug} className={treatmentSlug === t.slug ? "choice selected" : "choice"} onClick={() => setTreatmentSlug(t.slug)}><span><strong>{t.name}</strong><small>{t.duration} minutes · {t.category}</small></span><b>£{t.price}</b></button>)}</div><button className="button primary full" onClick={next}>Choose date</button></div>}
        {step === 2 && <div><span className="eyebrow">Step 2 of 5</span><h2>Select an available date</h2><p className="muted">Live availability will connect to Neon in Stage 3. These slots are design/demo data.</p><div className="date-grid">{dates.map(d => <button key={d} className={date === d ? "slot selected" : "slot"} onClick={() => setDate(d)}>{d}</button>)}</div><div className="booking-nav"><button className="button secondary" onClick={back}>Back</button><button disabled={!date} className="button primary" onClick={next}>Choose time</button></div></div>}
        {step === 3 && <div><span className="eyebrow">Step 3 of 5</span><h2>Choose your time</h2><div className="time-grid">{times.map(t => <button key={t} className={time === t ? "slot selected" : "slot"} onClick={() => setTime(t)}>{t}</button>)}</div><div className="booking-nav"><button className="button secondary" onClick={back}>Back</button><button disabled={!time} className="button primary" onClick={next}>Your details</button></div></div>}
        {step === 4 && <div><span className="eyebrow">Step 4 of 5</span><h2>Tell us who is booking</h2><div className="form-grid"><label>First name<input value={details.firstName} onChange={e=>setDetails({...details, firstName:e.target.value})}/></label><label>Last name<input value={details.lastName} onChange={e=>setDetails({...details, lastName:e.target.value})}/></label><label>Email<input type="email" value={details.email} onChange={e=>setDetails({...details, email:e.target.value})}/></label><label>Phone<input type="tel" value={details.phone} onChange={e=>setDetails({...details, phone:e.target.value})}/></label><label className="full-span">Optional notes<textarea rows={4} value={details.notes} onChange={e=>setDetails({...details, notes:e.target.value})}/></label></div><label className="check"><input type="checkbox" required/> I agree to the booking and cancellation policy.</label><div className="booking-nav"><button className="button secondary" onClick={back}>Back</button><button disabled={!details.firstName || !details.lastName || !details.email || !details.phone} className="button primary" onClick={next}>Confirm demo booking</button></div></div>}
        {step === 5 && <div className="success-card"><div className="success-icon">✓</div><span className="eyebrow">Stage 2 Demo</span><h2>Your booking flow is ready.</h2><p>The front-end journey is complete. In Stage 3, this final action will create a real Neon database appointment, protect the slot from double booking and send confirmation emails.</p><div className="summary-box"><div><span>Treatment</span><strong>{selected.name}</strong></div><div><span>Date</span><strong>{date}</strong></div><div><span>Time</span><strong>{time}</strong></div><div><span>Price</span><strong>£{selected.price}</strong></div></div><button className="button secondary" onClick={() => {setStep(1); setDate(""); setTime("");}}>Start again</button></div>}
      </div>
      <aside className="booking-summary"><span className="eyebrow">Your appointment</span><h3>{selected.name}</h3><p>{selected.short}</p><hr/><div><span>Duration</span><strong>{selected.duration} min</strong></div><div><span>Starting price</span><strong>£{selected.price}</strong></div>{date && <div><span>Date</span><strong>{date}</strong></div>}{time && <div><span>Time</span><strong>{time}</strong></div>}</aside>
    </div>
  </div>;
}
