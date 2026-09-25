export function isApiUnavailableError(error, status) {
  if (Number(status) >= 500 || error?.apiUnavailable) return true;
  if (error?.name === "TypeError") return true;
  const message = String(error?.message || error || "").toLowerCase();
  return /failed to fetch|networkerror|network request failed|load failed|connection refused/.test(message);
}
