import { getSeoRouteEntries, normalizeBaseUrl } from "@/_assets/utils/seo.utils";

function buildSitemapXml(baseUrl) {
  const entries = getSeoRouteEntries(baseUrl);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const xml = buildSitemapXml(normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL));
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function SitemapPage() {
  return null;
}
