"use client";

import { useRef } from "react";

const INSTAGRAM = "https://www.instagram.com/luminouss_skin_clinic/";

function embedUrl(url: string) {
  const clean = url.trim().split("?")[0].replace(/\/$/, "");
  return /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+$/.test(clean)
    ? `${clean}/embed/captioned/`
    : "";
}

export default function InstagramFeed({ urls, home=false }: { urls: string[]; home?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const posts = urls.map(embedUrl).filter(Boolean).slice(0, 6);
  const move=(direction:number)=>track.current?.scrollBy({left:direction*Math.min(410,track.current.clientWidth*.82),behavior:"smooth"});
  return <section className={`section instagram-section ${home?"instagram-home":""}`}><div className="container">
    <div className="instagram-heading"><div><span className="eyebrow">Real clinic updates</span><h2>Inside Luminous</h2><p>Real treatments, clinic moments and client progress from our official Instagram.</p></div><div className="instagram-heading-actions">{home&&<div className="instagram-controls"><button type="button" onClick={()=>move(-1)} aria-label="Previous Instagram post">←</button><button type="button" onClick={()=>move(1)} aria-label="Next Instagram post">→</button></div>}<a className="button instagram-button" href={INSTAGRAM} target="_blank" rel="noreferrer">Follow us on Instagram</a></div></div>
    {posts.length?<div className="instagram-rail"><div ref={track} className="instagram-grid">{posts.map((src,index)=><article className="instagram-post-card" key={src}><div className="instagram-card-label"><span>{String(index+1).padStart(2,"0")}</span><strong>{src.includes("/reel/")?"Clinic reel":"Instagram post"}</strong><a href={src.replace("/embed/captioned/","/")} target="_blank" rel="noreferrer" aria-label={`Open Instagram post ${index+1}`}>↗</a></div><div className="instagram-embed"><iframe src={src} title={`Luminous Skin Clinic Instagram post ${index+1}`} loading="lazy" allow="encrypted-media"/></div></article>)}</div></div>:<div className="empty-state"><h2>Instagram gallery</h2><p>Add public Instagram post URLs in Admin → Website CMS → Branding & social.</p></div>}
  </div></section>;
}
