import { NextRequest, NextResponse } from "next/server";

import { treatments } from "@/data/site";
import { query, withTransaction } from "@/lib/db";

export const dynamic = "force-dynamic";

const TIMES = ["10:00", "10:45", "11:30", "13:00", "14:30", "16:15"];

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validTime(value: string) {
  return TIMES.includes(value);
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const treatmentSlug = request.nextUrl.searchParams.get("treatment") ?? "";

  if (!validDate(date) || !treatments.some((item) => item.slug === treatmentSlug)) {
    return NextResponse.json({ message: "Invalid date or treatment." }, { status: 400 });
  }

  try {
    const booked = await query<{ appointment_time: string }>(
      `SELECT a.appointment_time::text
       FROM appointments a
       JOIN treatments t ON t.id = a.treatment_id
       WHERE a.appointment_date = $1
         AND t.slug = $2
         AND a.status NOT IN ('cancelled', 'declined')`,
      [date, treatmentSlug],
    );

    const unavailable = new Set(
      booked.rows.map((row) => row.appointment_time.slice(0, 5)),
    );

    return NextResponse.json({
      availableTimes: TIMES.filter((time) => !unavailable.has(time)),
    });
  } catch (error) {
    console.error("Availability lookup failed:", error);
    return NextResponse.json(
      { message: "Availability could not be loaded." },
      { status: 500 },
    );
  }
}

type BookingBody = {
  treatmentSlug?: string;
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  let body: BookingBody;

  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ message: "Invalid booking data." }, { status: 400 });
  }

  const treatment = treatments.find((item) => item.slug === body.treatmentSlug);
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.trim() ?? "";
  const notes = body.notes?.trim().slice(0, 2000) || null;
  const date = body.date ?? "";
  const time = body.time ?? "";

  if (
    !treatment ||
    !validDate(date) ||
    !validTime(time) ||
    !firstName ||
    !lastName ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    phone.length < 7
  ) {
    return NextResponse.json(
      { message: "Please complete all required booking details." },
      { status: 400 },
    );
  }

  const appointment = new Date(`${date}T${time}:00`);
  if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) {
    return NextResponse.json(
      { message: "Please choose a future appointment." },
      { status: 400 },
    );
  }

  try {
    const result = await withTransaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        `${treatment.slug}|${date}|${time}`,
      ]);

      let treatmentResult = await client.query<{ id: number }>(
        "SELECT id FROM treatments WHERE slug = $1 LIMIT 1",
        [treatment.slug],
      );

      if (!treatmentResult.rows[0]) {
        treatmentResult = await client.query<{ id: number }>(
          `INSERT INTO treatments
             (name, slug, category, price, duration_minutes, description, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)
           RETURNING id`,
          [
            treatment.name,
            treatment.slug,
            treatment.category,
            treatment.price,
            treatment.duration,
            treatment.description,
          ],
        );
      }

      const treatmentId = treatmentResult.rows[0].id;
      const duplicate = await client.query(
        `SELECT id FROM appointments
         WHERE treatment_id = $1
           AND appointment_date = $2
           AND appointment_time = $3
           AND status NOT IN ('cancelled', 'declined')
         LIMIT 1`,
        [treatmentId, date, time],
      );

      if (duplicate.rowCount) {
        return { conflict: true as const };
      }

      let customer = await client.query<{ id: number }>(
        "SELECT id FROM customers WHERE LOWER(email) = $1 ORDER BY id DESC LIMIT 1",
        [email],
      );

      if (customer.rows[0]) {
        await client.query(
          `UPDATE customers
           SET first_name = $1, last_name = $2, phone = $3
           WHERE id = $4`,
          [firstName, lastName, phone, customer.rows[0].id],
        );
      } else {
        customer = await client.query<{ id: number }>(
          `INSERT INTO customers (first_name, last_name, email, phone)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [firstName, lastName, email, phone],
        );
      }

      const reference = `LSC-${date.replaceAll("-", "")}-${crypto
        .randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

      const booking = await client.query<{ id: number }>(
        `INSERT INTO appointments
           (booking_reference, customer_id, treatment_id, appointment_date,
            appointment_time, status, payment_status, notes)
         VALUES ($1, $2, $3, $4, $5, 'pending', 'unpaid', $6)
         RETURNING id`,
        [reference, customer.rows[0].id, treatmentId, date, time, notes],
      );

      return {
        conflict: false as const,
        id: booking.rows[0].id,
        reference,
      };
    });

    if (result.conflict) {
      return NextResponse.json(
        { message: "This time has just been booked. Please select another slot." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        bookingId: result.id,
        bookingReference: result.reference,
        message: "Your appointment request has been received.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { message: "We could not create the booking. Please try again." },
      { status: 500 },
    );
  }
}
