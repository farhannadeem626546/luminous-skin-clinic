import type { TrustpilotSummary } from "@/components/TrustpilotCard";

export const TRUSTPILOT_URL = "https://uk.trustpilot.com/review/luminousskinclinic.co.uk";

export async function getTrustpilotSummary(): Promise<TrustpilotSummary> {
  const fallback = { rating: 4.5, count: 19, url: TRUSTPILOT_URL };
  try {
    const response = await fetch(TRUSTPILOT_URL, {
      headers: { "User-Agent": "Mozilla/5.0 LuminousSkinClinic/1.0" },
      next: { revalidate: 21600 }
    });
    if (!response.ok) return fallback;
    const html = await response.text();
    const ratingMatch = html.match(/"trustScore"\s*:\s*([0-9.]+)/) || html.match(/"ratingValue"\s*:\s*"?([0-9.]+)/);
    const countMatch = html.match(/"numberOfReviews"\s*:\s*\{[^}]*"total"\s*:\s*([0-9]+)/) || html.match(/"reviewCount"\s*:\s*"?([0-9]+)/);
    const rating = ratingMatch ? Number(ratingMatch[1]) : fallback.rating;
    const count = countMatch ? Number(countMatch[1]) : fallback.count;
    return { rating: Number.isFinite(rating) ? rating : fallback.rating, count: Number.isFinite(count) ? count : fallback.count, url: TRUSTPILOT_URL };
  } catch {
    return fallback;
  }
}
