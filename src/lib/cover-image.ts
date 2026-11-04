export const FALLBACK_COVER_IMAGE =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

export function getCoverImage(url?: string | null): string {
  if (!url) return FALLBACK_COVER_IMAGE;

  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_COVER_IMAGE;

  // Bing image search URLs contain the real image in the `mediaurl` param.
  if (trimmed.includes("bing.com/images/search")) {
    const match = trimmed.match(/[?&]mediaurl=([^&]+)/);
    if (!match) return FALLBACK_COVER_IMAGE;

    try {
      return decodeURIComponent(match[1]);
    } catch {
      return FALLBACK_COVER_IMAGE;
    }
  }

  // Accept any absolute or protocol-relative URL. Many CDNs (Pangobooks,
  // Unsplash, Shopify) serve images without a file extension.
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;

  return FALLBACK_COVER_IMAGE;
}
