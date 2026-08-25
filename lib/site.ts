/**
 * Публичный адрес сайта. Нужен для canonical, hreflang, Open Graph и sitemap:
 * без абсолютного адреса поисковики их не засчитывают.
 * На Vercel переменная проставляется автоматически.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
