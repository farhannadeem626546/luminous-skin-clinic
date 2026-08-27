import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/db";
const statuses = ["pending","confirmed","completed","cancelled","declined","no-show"];
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const result = await query(`SELECT a.id,a.booking_reference,a.appointment_date::text,a.appointment_time::text,a.status,a.payment_status,a.notes,a.created_at,c.first_name,c.last_name,c.email,c.phone,t.name AS treatment_name,t.price FROM appointments a JOIN customers c ON c.id=a.customer_id JOIN treatments t ON t.id=a.treatment_id ORDER BY a.appointment_date DESC,a.appointment_time DESC`);
  return NextResponse.json({ appointments: result.rows });
}
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: number; status?: string; paymentStatus?: string };
  if (!body.id || !body.status || !statuses.includes(body.status)) return NextResponse.json({ message: "Invalid update." }, { status: 400 });
  await query("UPDATE appointments SET status=$1, payment_status=COALESCE($2,payment_status) WHERE id=$3", [body.status, body.paymentStatus || null, body.id]);
  return NextResponse.json({ ok: true });
}
