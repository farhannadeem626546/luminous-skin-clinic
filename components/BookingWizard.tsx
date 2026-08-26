"use client";

import { useEffect, useMemo, useState } from "react";

import { treatments } from "@/data/site";

type Step = 1 | 2 | 3 | 4 | 5;
type Details = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

const ALL_TIMES = ["10:00", "10:45", "11:30", "13:00", "14:30", "16:15"];

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function displayTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hours, minutes));
}

export default function BookingWizard({ initialSlug }: { initialSlug?: string }) {
  const initial =
    treatments.find((treatment) => treatment.slug === initialSlug)?.slug ??
    treatments[0].slug;

  const dates = useMemo(() => {
    const result: { value: string; label: string }[] = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);

    while (result.length < 18) {
      if (cursor.getDay() !== 0) {
        const value = formatDateValue(cursor);
        result.push({ value, label: displayDate(value) });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }, []);

  const [step, setStep] = useState<Step>(1);
  const [treatmentSlug, setTreatmentSlug] = useState(initial);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState(ALL_TIMES);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [details, setDetails] = useState<Details>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const selected = useMemo(
    () => treatments.find((treatment) => treatment.slug === treatmentSlug)!,
    [treatmentSlug],
  );

  useEffect(() => {
    if (!date) return;

    const controller = new AbortController();
    setLoadingTimes(true);
    setTime("");
    setError("");

    fetch(
      `/api/bookings?date=${encodeURIComponent(date)}&treatment=${encodeURIComponent(
        treatmentSlug,
      )}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const data = (await response.json()) as {
          availableTimes?: string[];
          message?: string;
        };
        if (!response.ok) throw new Error(data.message ?? "Availability failed.");
        setAvailableTimes(data.availableTimes ?? []);
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof Error && fetchError.name === "AbortError") return;
        setAvailableTimes([]);
        setError("Availability could not be loaded. Please try again.");
      })
      .finally(() => setLoadingTimes(false));

    return () => controller.abort();
  }, [date, treatmentSlug]);

  const next = () => {
    setError("");
    setStep(Math.min(5, step + 1) as Step);
  };

  const back = () => {
    setError("");
    setStep(Math.max(1, step - 1) as Step);
  };

  const submitBooking = async () => {
    if (!agreed) {
      setError("Please agree to the booking and cancellation policy.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentSlug,
          date,
          time,
          ...details,
        }),
      });

      const data = (await response.json()) as {
        bookingReference?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Booking could not be created.");
      }

      setBookingReference(data.bookingReference ?? "");
      setStep(5);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Booking could not be created.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDate("");
    setTime("");
    setAgreed(false);
    setError("");
    setBookingReference("");
    setDetails({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    });
  };

  return (
    <div className="booking-shell">
      <div className="booking-progress">
        {[1, 2, 3, 4, 5].map((number) => (
          <span key={number} className={step >= number ? "active" : ""}>
            {number}
          </span>
        ))}
      </div>

      <div className="booking-layout">
        <div className="booking-main">
          {step === 1 && (
            <div>
              <span className="eyebrow">Step 1 of 5</span>
              <h2>Choose your treatment</h2>
              <div className="choice-list">
                {treatments.map((treatment) => (
                  <button
                    key={treatment.slug}
                    type="button"
                    className={
                      treatmentSlug === treatment.slug
                        ? "choice selected"
                        : "choice"
                    }
                    onClick={() => {
                      setTreatmentSlug(treatment.slug);
                      setDate("");
                      setTime("");
                    }}
                  >
                    <span>
                      <strong>{treatment.name}</strong>
                      <small>
                        {treatment.duration} minutes · {treatment.category}
                      </small>
                    </span>
                    <b>£{treatment.price}</b>
                  </button>
                ))}
              </div>
              <button type="button" className="button primary full" onClick={next}>
                Choose date
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="eyebrow">Step 2 of 5</span>
              <h2>Select an available date</h2>
              <p className="muted">Choose from the clinic&apos;s upcoming booking dates.</p>
              <div className="date-grid">
                {dates.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={date === item.value ? "slot selected" : "slot"}
                    onClick={() => setDate(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {error && <p role="alert" style={{ color: "#9b2c2c" }}>{error}</p>}
              <div className="booking-nav">
                <button type="button" className="button secondary" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  disabled={!date || loadingTimes}
                  className="button primary"
                  onClick={next}
                >
                  {loadingTimes ? "Checking..." : "Choose time"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="eyebrow">Step 3 of 5</span>
              <h2>Choose your time</h2>
              {loadingTimes ? (
                <p className="muted">Checking live availability...</p>
              ) : availableTimes.length ? (
                <div className="time-grid">
                  {availableTimes.map((availableTime) => (
                    <button
                      key={availableTime}
                      type="button"
                      className={time === availableTime ? "slot selected" : "slot"}
                      onClick={() => setTime(availableTime)}
                    >
                      {displayTime(availableTime)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="muted">No times remain on this date. Please choose another date.</p>
              )}
              {error && <p role="alert" style={{ color: "#9b2c2c" }}>{error}</p>}
              <div className="booking-nav">
                <button type="button" className="button secondary" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  disabled={!time}
                  className="button primary"
                  onClick={next}
                >
                  Your details
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="eyebrow">Step 4 of 5</span>
              <h2>Tell us who is booking</h2>
              <div className="form-grid">
                <label>
                  First name
                  <input
                    required
                    autoComplete="given-name"
                    value={details.firstName}
                    onChange={(event) =>
                      setDetails({ ...details, firstName: event.target.value })
                    }
                  />
                </label>
                <label>
                  Last name
                  <input
                    required
                    autoComplete="family-name"
                    value={details.lastName}
                    onChange={(event) =>
                      setDetails({ ...details, lastName: event.target.value })
                    }
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={details.email}
                    onChange={(event) =>
                      setDetails({ ...details, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  Phone
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(event) =>
                      setDetails({ ...details, phone: event.target.value })
                    }
                  />
                </label>
                <label className="full-span">
                  Optional notes
                  <textarea
                    rows={4}
                    maxLength={2000}
                    value={details.notes}
                    onChange={(event) =>
                      setDetails({ ...details, notes: event.target.value })
                    }
                  />
                </label>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                I agree to the booking and cancellation policy.
              </label>
              {error && <p role="alert" style={{ color: "#9b2c2c" }}>{error}</p>}
              <div className="booking-nav">
                <button type="button" className="button secondary" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  disabled={
                    submitting ||
                    !agreed ||
                    !details.firstName.trim() ||
                    !details.lastName.trim() ||
                    !details.email.trim() ||
                    !details.phone.trim()
                  }
                  className="button primary"
                  onClick={submitBooking}
                >
                  {submitting ? "Creating booking..." : "Confirm booking"}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="success-card">
              <div className="success-icon">✓</div>
              <span className="eyebrow">Booking received</span>
              <h2>Your appointment request is confirmed.</h2>
              <p>
                Please keep your booking reference. The clinic can now view this
                appointment in the database.
              </p>
              <div className="summary-box">
                <div>
                  <span>Reference</span>
                  <strong>{bookingReference}</strong>
                </div>
                <div>
                  <span>Treatment</span>
                  <strong>{selected.name}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{displayDate(date)}</strong>
                </div>
                <div>
                  <span>Time</span>
                  <strong>{displayTime(time)}</strong>
                </div>
                <div>
                  <span>Price</span>
                  <strong>£{selected.price}</strong>
                </div>
              </div>
              <button type="button" className="button secondary" onClick={reset}>
                Make another booking
              </button>
            </div>
          )}
        </div>

        <aside className="booking-summary">
          <span className="eyebrow">Your appointment</span>
          <h3>{selected.name}</h3>
          <p>{selected.short}</p>
          <hr />
          <div>
            <span>Duration</span>
            <strong>{selected.duration} min</strong>
          </div>
          <div>
            <span>Starting price</span>
            <strong>£{selected.price}</strong>
          </div>
          {date && (
            <div>
              <span>Date</span>
              <strong>{displayDate(date)}</strong>
            </div>
          )}
          {time && (
            <div>
              <span>Time</span>
              <strong>{displayTime(time)}</strong>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
