import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ message: "Cloudinary API Key or Secret is missing in Vercel." }, { status: 503 });
  const incoming = await request.formData();
  const file = incoming.get("file");
  const requestedFolder = String(incoming.get("folder") || "media").replace(/[^a-z0-9/_-]/gi, "-");
  if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ message: "Please select a valid image." }, { status: 400 });
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ message: "Image must be under 20MB." }, { status: 400 });
  const folder = `luminous-skin-clinic/${requestedFolder}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const body = new FormData(); body.set("file", file); body.set("api_key", apiKey); body.set("timestamp", String(timestamp)); body.set("folder", folder); body.set("signature", signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
  const data = await response.json() as { secure_url?: string; public_id?: string; width?: number; height?: number; error?: { message?: string } };
  if (!response.ok || !data.secure_url) return NextResponse.json({ message: data.error?.message || "Cloudinary upload failed." }, { status: 502 });
  await query(`CREATE TABLE IF NOT EXISTS media_assets(id BIGSERIAL PRIMARY KEY,public_id TEXT UNIQUE NOT NULL,secure_url TEXT NOT NULL,folder TEXT,file_name TEXT,width INTEGER,height INTEGER,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await query(`INSERT INTO media_assets(public_id,secure_url,folder,file_name,width,height) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(public_id) DO UPDATE SET secure_url=EXCLUDED.secure_url,width=EXCLUDED.width,height=EXCLUDED.height`,[data.public_id,data.secure_url,folder,file.name,data.width||null,data.height||null]);
  return NextResponse.json({ ok:true, url:data.secure_url, publicId:data.public_id });
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await query(`CREATE TABLE IF NOT EXISTS media_assets(id BIGSERIAL PRIMARY KEY,public_id TEXT UNIQUE NOT NULL,secure_url TEXT NOT NULL,folder TEXT,file_name TEXT,width INTEGER,height INTEGER,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  const result = await query("SELECT * FROM media_assets ORDER BY created_at DESC");
  return NextResponse.json({ assets: result.rows });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const cloudName=process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,apiKey=process.env.CLOUDINARY_API_KEY,apiSecret=process.env.CLOUDINARY_API_SECRET;
  const publicId=request.nextUrl.searchParams.get("publicId");
  if(!cloudName||!apiKey||!apiSecret||!publicId)return NextResponse.json({message:"Missing Cloudinary configuration or asset ID."},{status:400});
  const timestamp=Math.floor(Date.now()/1000);const signature=createHash("sha1").update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const body=new URLSearchParams({public_id:publicId,timestamp:String(timestamp),api_key:apiKey,signature});
  const response=await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
  const data=await response.json() as{result?:string};if(!response.ok||!data.result)return NextResponse.json({message:"Cloudinary deletion failed."},{status:502});
  await query("DELETE FROM media_assets WHERE public_id=$1",[publicId]);return NextResponse.json({ok:true,result:data.result});
}
