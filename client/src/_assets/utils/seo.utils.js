export const DEFAULT_SITE_NAME = "Le Ventadour";
export const DEFAULT_SITE_URL = "http://localhost:8003";
export const DEFAULT_SOCIAL_IMAGE = "/img/home/hero-restaurant.webp";
export const DEFAULT_LOGO_IMAGE = "/favicon.svg";

const schemaDays = {
  lundi: "Monday", monday: "Monday",
  mardi: "Tuesday", tuesday: "Tuesday",
  mercredi: "Wednesday", wednesday: "Wednesday",
  jeudi: "Thursday", thursday: "Thursday",
  vendredi: "Friday", friday: "Friday",
  samedi: "Saturday", saturday: "Saturday",
  dimanche: "Sunday", sunday: "Sunday",
};

const normalizeText = (value) => String(value || "").trim();

export function normalizeBaseUrl(value) {
  const candidate = normalizeText(value).replace(/^['"]|['"]$/g, "").replace(/\s+/g, "");
  if (!candidate) return DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  return withProtocol.replace(/\/+$/, "");
}

export function buildAbsoluteUrl(baseUrl, path = "") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}${path ? (path.startsWith("/") ? path : `/${path}`) : ""}`;
}

export function getSeoRouteEntries(baseUrl) {
  return [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/carte-menus", priority: "0.9", changefreq: "weekly" },
    { path: "/reservations", priority: "0.9", changefreq: "weekly" },
    { path: "/traiteur", priority: "0.8", changefreq: "monthly" },
    { path: "/contact", priority: "0.8", changefreq: "monthly" },
    { path: "/news", priority: "0.7", changefreq: "weekly" },
    { path: "/legales", priority: "0.3", changefreq: "yearly" },
    { path: "/policy", priority: "0.3", changefreq: "yearly" },
  ].map((route) => ({ ...route, url: buildAbsoluteUrl(baseUrl, route.path) }));
}

function compactObject(value) {
  if (Array.isArray(value)) return value.map(compactObject).filter((item) => item != null && item !== "");
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .map(([key, entry]) => [key, compactObject(entry)])
    .filter(([, entry]) => entry != null && entry !== "" && (!Array.isArray(entry) || entry.length)));
}

function normalizeSocialUrl(value) {
  const url = normalizeText(value);
  if (!url) return "";
  return /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
}

function getSocialLinks(restaurant) {
  return ["facebook", "instagram", "tiktok", "youtube", "linkedIn"]
    .map((network) => normalizeSocialUrl(restaurant?.social_media?.[network]))
    .filter(Boolean);
}

function getAddress(address) {
  const streetAddress = normalizeText(address?.line1);
  const postalCode = normalizeText(address?.zipCode);
  const locality = normalizeText(address?.city);
  if (!streetAddress && !postalCode && !locality) return undefined;
  return compactObject({
    "@type": "PostalAddress",
    streetAddress,
    postalCode,
    addressLocality: locality,
    addressRegion: normalizeText(address?.region || address?.state),
    addressCountry: normalizeText(address?.country) || "FR",
  });
}

function getOpeningHours(openingHours) {
  if (!Array.isArray(openingHours)) return [];
  return openingHours.flatMap((day) => {
    const dayKey = normalizeText(day?.day).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dayOfWeek = schemaDays[dayKey];
    if (!dayOfWeek || day?.isClosed || !Array.isArray(day?.hours)) return [];
    return day.hours.flatMap((range) => {
      const opens = normalizeText(range?.open);
      const closes = normalizeText(range?.close);
      return opens && closes ? [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }] : [];
    });
  });
}

export function buildSeoSchemas({ baseUrl, title, description, canonicalUrl, imageUrl, restaurant, breadcrumbs = [] }) {
  const organizationId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}/#website`;
  const restaurantId = `${baseUrl}/#restaurant`;
  const socialLinks = getSocialLinks(restaurant);
  const address = getAddress(restaurant?.address);
  const phone = normalizeText(restaurant?.phone);
  const email = normalizeText(restaurant?.email);
  const addressQuery = [restaurant?.address?.line1, restaurant?.address?.zipCode, restaurant?.address?.city]
    .map(normalizeText).filter(Boolean).join(", ");

  const schemas = [
    {
      "@context": "https://schema.org", "@type": "Organization", "@id": organizationId,
      name: DEFAULT_SITE_NAME, url: baseUrl,
      logo: { "@type": "ImageObject", url: buildAbsoluteUrl(baseUrl, DEFAULT_LOGO_IMAGE) },
      image: imageUrl, sameAs: socialLinks,
      contactPoint: phone || email ? compactObject({ "@type": "ContactPoint", contactType: "customer service", telephone: phone, email, availableLanguage: ["fr"] }) : undefined,
    },
    {
      "@context": "https://schema.org", "@type": "WebSite", "@id": websiteId,
      name: DEFAULT_SITE_NAME, url: baseUrl, inLanguage: "fr-FR", publisher: { "@id": organizationId },
    },
    {
      "@context": "https://schema.org", "@type": "WebPage", "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl, name: title, description, inLanguage: "fr-FR",
      isPartOf: { "@id": websiteId }, primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
      about: { "@id": restaurantId },
    },
    {
      "@context": "https://schema.org", "@type": "Restaurant", "@id": restaurantId,
      name: DEFAULT_SITE_NAME, url: baseUrl, image: imageUrl,
      logo: buildAbsoluteUrl(baseUrl, DEFAULT_LOGO_IMAGE),
      servesCuisine: ["Cuisine française", "Cuisine de saison", "Traiteur"],
      acceptsReservations: true, menu: buildAbsoluteUrl(baseUrl, "/carte-menus"),
      telephone: phone, email, address, openingHoursSpecification: getOpeningHours(restaurant?.opening_hours),
      hasMap: addressQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}` : undefined,
      currenciesAccepted: "EUR", sameAs: socialLinks, mainEntityOfPage: canonicalUrl,
      parentOrganization: { "@id": organizationId },
    },
  ];

  if (breadcrumbs.length) schemas.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: buildAbsoluteUrl(baseUrl, item.path) })),
  });

  return schemas.map(compactObject);
}
