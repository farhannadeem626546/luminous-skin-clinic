export type TrustpilotSummary = { rating: number; count: number; url: string };

export default function TrustpilotCard({ summary }: { summary: TrustpilotSummary }) {
  return <a className="trustpilot-card" href={summary.url} target="_blank" rel="noreferrer" aria-label={`Read ${summary.count} Luminous Skin Clinic reviews on Trustpilot`}>
    <span className="trustpilot-brand">★ Trustpilot</span>
    <strong>{summary.rating.toFixed(1)} <small>Excellent</small></strong>
    <span className="trustpilot-stars">★★★★★</span>
    <span>Based on {summary.count} customer reviews →</span>
  </a>;
}
