"use client";
import { useEffect, useState } from "react";

type Asset={id:number;secure_url:string;public_id:string;file_name?:string;resource_type?:"image"|"video"};
type Signature={cloudName:string;apiKey:string;timestamp:number;folder:string;signature:string;resourceType:"image"|"video";message?:string};
type CloudinaryResult={secure_url?:string;public_id?:string;width?:number;height?:number;bytes?:number;error?:{message?:string}};

export default function CloudinaryUploader(){
  const[assets,setAssets]=useState<Asset[]>([]);const[folder,setFolder]=useState("services");const[busy,setBusy]=useState(false);const[msg,setMsg]=useState("");
  async function load(){const r=await fetch("/api/admin/upload");const d=await r.json();setAssets(d.assets||[])}
  useEffect(()=>{load()},[]);
  async function upload(file?:File){
    if(!file)return;const resourceType=file.type.startsWith("video/")?"video":file.type.startsWith("image/")?"image":"";if(!resourceType){setMsg("Only image and video files are supported.");return}const limit=resourceType==="video"?100:20;if(file.size>limit*1024*1024){setMsg(`${resourceType==="video"?"Video":"Image"} must be under ${limit}MB.`);return}
    setBusy(true);setMsg("");
    try{
      const signResponse=await fetch("/api/admin/upload/sign",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({folder,resourceType})});const sign=await signResponse.json() as Signature;if(!signResponse.ok)throw new Error(sign.message||"Could not prepare Cloudinary upload.");
      const body=new FormData();body.set("file",file);body.set("api_key",sign.apiKey);body.set("timestamp",String(sign.timestamp));body.set("folder",sign.folder);body.set("signature",sign.signature);
      const cloudResponse=await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/${resourceType}/upload`,{method:"POST",body});const cloud=await cloudResponse.json() as CloudinaryResult;if(!cloudResponse.ok||!cloud.secure_url||!cloud.public_id)throw new Error(cloud.error?.message||"Cloudinary upload failed.");
      const recordResponse=await fetch("/api/admin/upload/record",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({publicId:cloud.public_id,secureUrl:cloud.secure_url,folder:sign.folder,fileName:file.name,width:cloud.width,height:cloud.height,bytes:cloud.bytes||file.size,resourceType})});if(!recordResponse.ok)throw new Error("Media uploaded, but it could not be added to the library.");
      setMsg(`${resourceType==="video"?"Video":"Image"} uploaded. Copy its URL into a service or website editor.`);await load();
    }catch(error){setMsg(error instanceof Error?error.message:"Upload failed.")}finally{setBusy(false)}
  }
  return <div className="admin-editor"><h2>Cloudinary Media Library</h2><p className="muted">Upload service images and videos here, then copy the URL into the Services or Website CMS editor.</p><div className="media-upload-row"><select value={folder} onChange={e=>setFolder(e.target.value)}><option value="services">Services</option><option value="homepage">Homepage</option><option value="treatments">Treatments</option><option value="results">Before & After</option><option value="practitioners">Practitioner</option><option value="gallery">Clinic Gallery</option><option value="branding">Logo & Branding</option><option value="website">Other Website Media</option></select><label className="button primary">{busy?"Uploading...":"Upload image or video"}<input hidden disabled={busy} type="file" accept="image/*,video/*" onChange={e=>upload(e.target.files?.[0])}/></label></div>{msg&&<p className="admin-notice">{msg}</p>}<div className="media-library">{assets.map(a=><article key={a.id}>{a.resource_type==="video"?<video src={a.secure_url} controls preload="metadata"/>:<img src={a.secure_url} alt={a.file_name||"Uploaded media"}/>}<small>{a.file_name||a.public_id}</small><button className="mini-button" onClick={()=>navigator.clipboard.writeText(a.secure_url)}>Copy URL</button><button className="mini-button danger" onClick={async()=>{if(!confirm(`Delete this ${a.resource_type||"image"} from Cloudinary?`))return;const r=await fetch(`/api/admin/upload?publicId=${encodeURIComponent(a.public_id)}`,{method:"DELETE"});const d=await r.json();setMsg(r.ok?"Media deleted.":d.message||"Delete failed.");if(r.ok)await load()}}>Delete</button></article>)}</div></div>;
}
