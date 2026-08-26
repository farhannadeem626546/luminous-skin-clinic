import { NextResponse } from "next/server";

import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query<{ database_time: Date }>(
      "SELECT NOW() AS database_time",
    );

    return NextResponse.json({
      ok: true,
      message: "Neon database is connected.",
      databaseTime: result.rows[0]?.database_time ?? null,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Database connection failed.",
      },
      { status: 500 },
    );
  }
}
