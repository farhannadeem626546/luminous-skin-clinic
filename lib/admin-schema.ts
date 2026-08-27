import { query } from "@/lib/db";

export async function ensureAdminSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS working_hours (
      id SERIAL PRIMARY KEY, day_of_week INTEGER UNIQUE NOT NULL,
      is_open BOOLEAN NOT NULL DEFAULT true, open_time TIME, close_time TIME
    );
    CREATE TABLE IF NOT EXISTS blocked_dates (
      id SERIAL PRIMARY KEY, blocked_date DATE UNIQUE NOT NULL, reason TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY, client_name TEXT NOT NULL, treatment_name TEXT,
      rating INTEGER NOT NULL DEFAULT 5, review_text TEXT NOT NULL,
      is_approved BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE treatments ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE treatments ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 60;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS client_name TEXT;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS treatment_name TEXT;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 5;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_text TEXT;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    INSERT INTO working_hours (day_of_week,is_open,open_time,close_time) VALUES
      (0,false,NULL,NULL),(1,true,'10:00','17:00'),(2,true,'10:00','17:00'),
      (3,true,'10:00','17:00'),(4,true,'10:00','17:00'),(5,true,'10:00','17:00'),(6,true,'10:00','16:00')
    ON CONFLICT (day_of_week) DO NOTHING;
  `);
}
