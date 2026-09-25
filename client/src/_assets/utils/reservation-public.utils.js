import { formatReservationDateForApi, parseReservationDateValue } from "./reservations.utils";

export function formatPublicReservationDate(value) {
  const date = parseReservationDateValue(value);
  return date ? new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date) : "Date à confirmer";
}

export function formatPublicReservationDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function getReservationEditDate(value) {
  return formatReservationDateForApi(value);
}

export function reservationStatusLabel(status) {
  return ({ Pending: "En attente", Confirmed: "Confirmée", AwaitingBankHold: "Validation carte requise", Canceled: "Annulée", Rejected: "Refusée", Finished: "Terminée", Active: "En cours", Late: "En retard", NoShow: "Non honorée", Waitlist: "Liste d’attente" })[String(status || "")] || "Réservation";
}

export function publicReservationError(payload, status, fallback) {
  const code = String(payload?.code || "");
  const message = String(payload?.message || "").toLowerCase();
  if (status === 404 || message.includes("introuvable") || message.includes("not found")) return "Cette réservation est introuvable ou le lien n’est plus valide.";
  if (status === 403 || code === "INVALID_MANAGE_TOKEN") return "Ce lien de gestion est invalide ou incomplet.";
  if (code === "NOT_MODIFIABLE" || message.includes("ne peut plus être")) return "Cette réservation ne peut plus être modifiée ou annulée en ligne.";
  if (message.includes("déjà annul")) return "Cette réservation est déjà annulée.";
  if (status === 409 || code === "DAY_LOCK_TIMEOUT") return "Le créneau a changé depuis votre sélection. Choisissez un autre horaire et réessayez.";
  return fallback;
}
