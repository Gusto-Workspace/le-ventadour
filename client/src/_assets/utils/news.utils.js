const fallbackLabels = ["À table", "Au fil des saisons", "Le Ventadour"];

export function stripNewsHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getNewsLabel(item, index = 0) {
  return String(item?.label || item?.category || item?.tag || item?.type || fallbackLabels[index % fallbackLabels.length]);
}

export function getNewsExcerpt(value, maxLength = 180) {
  const plainText = stripNewsHtml(value);
  return plainText.length > maxLength ? `${plainText.slice(0, maxLength).trim()}…` : plainText;
}

export function getVisibleNews(restaurant) {
  return [...(Array.isArray(restaurant?.news) ? restaurant.news : [])]
    .filter((item) => item?.visible !== false)
    .sort((a, b) => (new Date(b?.published_at).getTime() || 0) - (new Date(a?.published_at).getTime() || 0));
}

export function hasVisibleNews(restaurant) {
  return getVisibleNews(restaurant).length > 0;
}

export function formatNewsDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function getNewsImage(item) {
  return String(item?.image || "/img/home/plat-poisson.png");
}
