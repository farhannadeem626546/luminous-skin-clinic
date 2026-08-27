import type { Metadata } from "next";

import BookingWizard from "@/components/BookingWizard";
import { getTreatments } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Choose a Luminous Skin Clinic treatment and request an available appointment online.",
};

export default async function Booking({
  searchParams,
}: {
  searchParams: Promise<{ treatment?: string }>;
}) {
  const query = await searchParams;
  const treatments = await getTreatments();

  return (
    <>
      <section className="booking-hero">
        <div className="container narrow">
          <span className="eyebrow">Online booking</span>
          <h1>Choose your treatment and appointment.</h1>
          <p>
            Check live availability, choose your preferred time and receive your
            booking reference instantly.
          </p>
        </div>
      </section>
      <section className="section booking-section">
        <div className="container">
          <BookingWizard initialSlug={query.treatment} treatmentOptions={treatments} />
        </div>
      </section>
    </>
  );
}
