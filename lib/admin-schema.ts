import { query } from "@/lib/db";

const serviceCategories = [
  ["clinic-facials", "All Clinic Facials", "Personalised clinic facials for cleansing, relaxation, glow and age-supporting care.", 1],
  ["massage-therapy", "Massage Therapy", "Relaxing and targeted massage therapies designed around comfort and wellbeing.", 2],
  ["facial-skin-treatments", "Facial Skin Treatments", "Professional facial skin treatments and technology-led add-ons.", 3],
] as const;

export const serviceSeeds = [
  ["classic-facial", "Classic Facial", "All Clinic Facials", 25, 60],
  ["extraction-deep-cleansing-facial", "Extraction Deep Cleansing Facial", "All Clinic Facials", 30, 60],
  ["signature-spa-facial", "Signature Spa Facial", "All Clinic Facials", 25, 60],
  ["ultimate-glow-facial", "Ultimate Glow Facial", "All Clinic Facials", 90, 75],
  ["enzyme-peel-facial-cold-therapy", "Enzyme Peel Facial + Cold Therapy", "All Clinic Facials", 90, 75],
  ["anti-aging-facial-massages", "All Anti-Aging Facial Massages", "All Clinic Facials", 90, 75],
  ["swedish-relaxing-therapy", "Swedish Relaxing Therapy", "Massage Therapy", 25, 60],
  ["deep-tissue-therapy", "Deep Tissue Therapy", "Massage Therapy", 35, 60],
  ["hot-stone-massage-therapy", "Hot Stone Therapy", "Massage Therapy", 35, 60],
  ["aroma-therapy-asmr", "Aroma Therapy & ASMR", "Massage Therapy", 35, 60],
  ["lymphatic-wood-sculpt-massage", "Lymphatic (Wood Sculpt Massage)", "Massage Therapy", 35, 60],
  ["indian-head-hand-foot-reflexology", "Indian Head, Hand & Foot Reflexology", "Massage Therapy", 35, 60],
  ["led-light-therapy-for-pains", "LED Light Therapy for Pains (Add on)", "Massage Therapy", 35, 30],
  ["facial-led-light-treatment", "LED Light Treatment", "Facial Skin Treatments", 15, 30],
  ["skin-regenerate-replenish-oxygen-therapy", "Skin Regenerate & Replenish (Oxygen Therapy)", "Facial Skin Treatments", 35, 60],
  ["full-hydrafacial-ot-rf-led", "Full Hydrafacial Inc. (OT + RF + LED)", "Facial Skin Treatments", 35, 60],
  ["micro-hydro-dermabrasion-ot", "Micro/Hydro Dermabrasion with OT", "Facial Skin Treatments", 35, 60],
  ["acne-treatment-high-frequency", "Acne Treatment (High Frequency)", "Facial Skin Treatments", 35, 45],
  ["rf-skin-tightening-full-facial", "RF Skin Tightening Full Facial Treatment", "Facial Skin Treatments", 35, 60],
  ["microneedling-treatment", "Microneedling", "Facial Skin Treatments", 35, 60],
  ["dry-skin-hydration-infused", "Intense Therapy for Dry Skin (Hydration Infused)", "Facial Skin Treatments", 35, 60],
  ["dermaplaning-full-facial", "Dermaplaning Treatment (Full Facial)", "Facial Skin Treatments", 35, 60],
  ["ultrasound-galvanic-cold-therapy", "Ultrasound, Galvanic & Cold Therapy (Add on)", "Facial Skin Treatments", 35, 30],
  ["eyebrow-tinting-face-threading", "Eyebrow Shaping & Tinting + Face Threading", "Facial Skin Treatments", 35, 45],
] as const;

export async function ensureAdminSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS working_hours (id SERIAL PRIMARY KEY,day_of_week INTEGER UNIQUE NOT NULL,is_open BOOLEAN NOT NULL DEFAULT true,open_time TIME,close_time TIME)`,
    `CREATE TABLE IF NOT EXISTS blocked_dates (id SERIAL PRIMARY KEY,blocked_date DATE UNIQUE NOT NULL,reason TEXT,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS clinic_working_hours (id SERIAL PRIMARY KEY,day_of_week INTEGER UNIQUE NOT NULL,is_open BOOLEAN NOT NULL DEFAULT true,open_time TIME,close_time TIME)`,
    `CREATE TABLE IF NOT EXISTS clinic_blocked_dates (id SERIAL PRIMARY KEY,blocked_date DATE UNIQUE NOT NULL,reason TEXT,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS reviews (id SERIAL PRIMARY KEY,client_name TEXT,treatment_name TEXT,rating INTEGER NOT NULL DEFAULT 5,review_text TEXT,is_approved BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS service_categories (id BIGSERIAL PRIMARY KEY,slug TEXT UNIQUE NOT NULL,name TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',image_url TEXT,video_url TEXT,sort_order INTEGER NOT NULL DEFAULT 0,is_active BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 60`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS deposit NUMERIC NOT NULL DEFAULT 0`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS short_description TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS benefits TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS suitable_for TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS aftercare TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS image_url TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS video_url TEXT`,
    `ALTER TABLE treatments ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
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
  for (const [slug,name,description,sortOrder] of serviceCategories) {
    try { await query(`INSERT INTO service_categories(slug,name,description,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(slug) DO NOTHING`,[slug,name,description,sortOrder]); } catch (error) { console.warn("Service-category seed skipped:", error); }
  }
  for (const [slug,name,category,price,duration] of serviceSeeds) {
    try {
      await query(`INSERT INTO treatments(name,slug,category,price,duration_minutes,description,is_active)
        SELECT $1,$2,$3,$4,$5,$6,true
        WHERE NOT EXISTS(SELECT 1 FROM treatments WHERE slug=$2)`,[
        name,slug,category,price,duration,
        `${name} is delivered following a suitability check, with the treatment plan explained clearly before your appointment begins.`
      ]);
    } catch (error) { console.warn("Service seed skipped:", error); }
  }
  for (const [day,isOpen,open,close] of [[0,false,null,null],[1,true,"10:00","17:00"],[2,true,"10:00","17:00"],[3,true,"10:00","17:00"],[4,true,"10:00","17:00"],[5,true,"10:00","17:00"],[6,true,"10:00","16:00"]] as const) {
    try { await query(`INSERT INTO working_hours(day_of_week,is_open,open_time,close_time) SELECT $1,$2,$3,$4 WHERE NOT EXISTS(SELECT 1 FROM working_hours WHERE day_of_week=$1)`,[day,isOpen,open,close]); } catch (error) { console.warn("Working-hours default skipped:", error); }
    try { await query(`INSERT INTO clinic_working_hours(day_of_week,is_open,open_time,close_time) SELECT $1,$2,$3,$4 WHERE NOT EXISTS(SELECT 1 FROM clinic_working_hours WHERE day_of_week=$1)`,[day,isOpen,open,close]); } catch (error) { console.warn("Clinic working-hours default skipped:", error); }
  }
}
