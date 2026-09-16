import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const cloudName=process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,apiKey=process.env.CLOUDINARY_API_KEY,apiSecret=process.env.CLOUDINARY_API_SECRET;
  if(!cloudName||!apiKey||!apiSecret)return NextResponse.json({message:"Cloudinary configuration is missing in Vercel."},{status:503});
  const body=await request.json();
  const folder=`luminous-skin-clinic/${String(body.folder||"media").replace(/[^a-z0-9/_-]/gi,"-")}`;
  const resourceType=body.resourceType==="video"?"video":"image";
  const timestamp=Math.floor(Date.now()/1000);
  const signature=createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  return NextResponse.json({cloudName,apiKey,timestamp,folder,signature,resourceType});
}
