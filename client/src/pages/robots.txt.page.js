import { normalizeBaseUrl } from "@/_assets/utils/seo.utils";

function buildRobotsTxt(baseUrl) {
  return `User-agent: *
Allow: /

Disallow: /404
Disallow: /reservations/*
Disallow: /reservations/waitlist-offer/

Sitemap: ${baseUrl}/sitemap.xml
`;
}

export async function getServerSideProps({ res }) {
  const text = buildRobotsTxt(normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL));
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex");
  res.write(text);
  res.end();
  return { props: {} };
}

export default function RobotsPage() {
  return null;
}
