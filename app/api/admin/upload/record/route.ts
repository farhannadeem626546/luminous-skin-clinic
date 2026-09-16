import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/db";

export async function POST(request:NextRequest){
  if(!(await isAdmin()))return NextResponse.json({message:"Unauthorized"},{status:401});
  const b=await request.json();
  if(!b.publicId||!b.secureUrl)return NextResponse.json({message:"Cloudinary asset details are required."},{status:400});
  await query(`CREATE TABLE IF NOT EXISTS media_assets(id BIGSERIAL PRIMARY KEY,public_id TEXT UNIQUE NOT NULL,secure_url TEXT NOT NULL,folder TEXT,file_name TEXT,width INTEGER,height INTEGER,resource_type TEXT NOT NULL DEFAULT 'image',bytes BIGINT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await query(`ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS resource_type TEXT NOT NULL DEFAULT 'image'`);
  await query(`ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS bytes BIGINT`);
  await query(`INSERT INTO media_assets(public_id,secure_url,folder,file_name,width,height,resource_type,bytes) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(public_id) DO UPDATE SET secure_url=EXCLUDED.secure_url,width=EXCLUDED.width,height=EXCLUDED.height,resource_type=EXCLUDED.resource_type,bytes=EXCLUDED.bytes`,[b.publicId,b.secureUrl,b.folder||null,b.fileName||null,b.width||null,b.height||null,b.resourceType==="video"?"video":"image",b.bytes||null]);
  return NextResponse.json({ok:true});
}
