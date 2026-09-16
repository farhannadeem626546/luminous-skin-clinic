import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { ensureAdminSchema } from "@/lib/admin-schema";
import { query } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await ensureAdminSchema();
  const result = await query("SELECT id,slug,name,description,image_url,video_url,sort_order,is_active FROM service_categories ORDER BY sort_order,name");
  return NextResponse.json({ categories: result.rows });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.slug) return NextResponse.json({ message: "Name and slug are required." }, { status: 400 });
  await ensureAdminSchema();
  await query(`INSERT INTO service_categories(slug,name,description,image_url,video_url,sort_order,is_active) VALUES($1,$2,$3,$4,$5,$6,$7)`, [body.slug, body.name, body.description || "", body.image_url || null, body.video_url || null, Number(body.sort_order) || 0, body.is_active !== false]);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.id) return NextResponse.json({ message: "ID is required." }, { status: 400 });
  await ensureAdminSchema();
  await query(`UPDATE service_categories SET slug=$1,name=$2,description=$3,image_url=$4,video_url=$5,sort_order=$6,is_active=$7,updated_at=NOW() WHERE id=$8`, [body.slug, body.name, body.description || "", body.image_url || null, body.video_url || null, Number(body.sort_order) || 0, Boolean(body.is_active), body.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ message: "ID is required." }, { status: 400 });
  await query("UPDATE service_categories SET is_active=false,updated_at=NOW() WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
