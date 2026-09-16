const INSTAGRAM = "https://www.instagram.com/luminouss_skin_clinic/";

function embedUrl(url: string) {
  const clean = url.trim().split("?")[0].replace(/\/$/, "");
  return /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+$/.test(clean)
    ? `${clean}/embed/captioned/`
    : "";
}

export default function InstagramFeed({ urls }: { urls: string[] }) {
  const posts = urls.map(embedUrl).filter(Boolean).slice(0, 6);
  return <section className="section instagram-section"><div className="container">
    <div className="instagram-heading"><div><span className="eyebrow">Real clinic updates</span><h2>Follow our work on Instagram</h2><p>Clinic moments, treatment education and consented client progress from our official profile.</p></div><a className="button instagram-button" href={INSTAGRAM} target="_blank" rel="noreferrer">Follow @luminouss_skin_clinic</a></div>
    {posts.length?<div className="instagram-grid">{posts.map((src,index)=><div className="instagram-embed" key={src}><iframe src={src} title={`Luminous Skin Clinic Instagram post ${index+1}`} loading="lazy" allow="encrypted-media"/></div>)}</div>:<div className="empty-state"><h2>Instagram gallery</h2><p>Add public Instagram post URLs in Admin → Website CMS → Branding & social.</p></div>}
  </div></section>;
}
