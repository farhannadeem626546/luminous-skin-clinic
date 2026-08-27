import { query } from "@/lib/db";

export async function ensureAdminSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS working_hours (id SERIAL PRIMARY KEY,day_of_week INTEGER UNIQUE NOT NULL,is_open BOOLEAN NOT NULL DEFAULT true,open_time TIME,close_time TIME)`,
    `CREATE TABLE IF NOT EXISTS blocked_dates (id SERIAL PRIMARY KEY,blocked_date DATE UNIQUE NOT NULL,reason TEXT,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS clinic_working_hours (id SERIAL PRIMARY KEY,day_of_week INTEGER UNIQUE NOT NULL,is_open BOOLEAN NOT NULL DEFAULT true,open_time TIME,close_time TIME)`,
    `CREATE TABLE IF NOT EXISTS clinic_blocked_dates (id SERIAL PRIMARY KEY,blocked_date DATE UNIQUE NOT NULL,reason TEXT,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS reviews (id SERIAL PRIMARY KEY,client_name TEXT,treatment_name TEXT,rating INTEGER NOT NULL DEFAULT 5,review_text TEXT,is_approved BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 60`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS deposit NUMERIC NOT NULL DEFAULT 0`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS short_description TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS benefits TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS suitable_for TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS aftercare TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS image_url TEXT`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS client_name TEXT`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS treatment_name TEXT`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 5`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_text TEXT`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`
  ];
  for (const statement of statements) {
    try { await query(statement); } catch (error) { console.warn("Optional admin schema step skipped:", error); }
  }
  for (const [day,isOpen,open,close] of [[0,false,null,null],[1,true,"10:00","17:00"],[2,true,"10:00","17:00"],[3,true,"10:00","17:00"],[4,true,"10:00","17:00"],[5,true,"10:00","17:00"],[6,true,"10:00","16:00"]] as const) {
    try { await query(`INSERT INTO working_hours(day_of_week,is_open,open_time,close_time) SELECT $1,$2,$3,$4 WHERE NOT EXISTS(SELECT 1 FROM working_hours WHERE day_of_week=$1)`,[day,isOpen,open,close]); } catch (error) { console.warn("Working-hours default skipped:", error); }
    try { await query(`INSERT INTO clinic_working_hours(day_of_week,is_open,open_time,close_time) SELECT $1,$2,$3,$4 WHERE NOT EXISTS(SELECT 1 FROM clinic_working_hours WHERE day_of_week=$1)`,[day,isOpen,open,close]); } catch (error) { console.warn("Clinic working-hours default skipped:", error); }
  }
}
