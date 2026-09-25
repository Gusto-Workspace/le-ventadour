import { useEffect, useState } from "react";
import { useRestaurant } from "@/contexts/restaurant.context";
import { formatPublicReservationDate, formatPublicReservationDateTime } from "@/_assets/utils/reservation-public.utils";

function offerError(status, fallback = "Cette proposition n’est plus disponible.") {
  if (status === 404) return "Ce lien de proposition est invalide ou n’est plus disponible.";
  if (status === 410) return "Le délai de réponse à cette proposition a expiré.";
  if (status === 409) return "Cette place n’est plus disponible. Le restaurant vous informera si une autre place se libère.";
  return fallback;
}

export default function WaitlistOffer({ token }) {
  const { apiUrl, restaurant } = useRestaurant();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadOffer() {
      if (!token || !apiUrl) { setError("Ce lien de proposition est invalide."); setLoading(false); return; }
      try {
        const response = await fetch(`${apiUrl}/reservations/waitlist-offers/${token}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(offerError(response.status));
        if (active) setOffer(payload);
      } catch (requestError) {
        if (active) setError(requestError.message || "Cette proposition n’est plus disponible.");
      } finally { if (active) setLoading(false); }
    }
    loadOffer();
    return () => { active = false; };
  }, [apiUrl, token]);

  async function respond(action) {
    if (busy || offer?.state !== "offered") return;
    setBusy(action); setError(""); setMessage("");
    try {
      const response = await fetch(`${apiUrl}/reservations/waitlist-offers/${token}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404 || response.status === 409 || response.status === 410) setOffer((current) => ({ ...current, state: "expired" }));
        throw new Error(offerError(response.status, "Impossible de répondre à cette proposition. Réessayez."));
      }
      if (payload.requiresAction) {
        if (!payload.redirectUrl || !payload.reservationId) throw new Error("La validation bancaire ne peut pas être ouverte. Contactez le restaurant.");
        localStorage.setItem("gm_pending_bank_hold", JSON.stringify({ reservationId: String(payload.reservationId), restaurantId: String(payload.reservation?.restaurant_id || restaurant?._id || "") }));
        window.location.href = payload.redirectUrl;
        return;
      }
      setOffer((current) => ({ ...current, state: action === "accept" ? "accepted" : "declined", reservation: payload.reservation || current?.reservation }));
      setMessage(action === "accept" ? "Votre réservation est confirmée. Le lien de votre e-mail permet de la modifier ou de l’annuler selon les conditions du restaurant." : "Votre refus a bien été pris en compte.");
    } catch (responseError) { setError(responseError.message || "Impossible de répondre à cette proposition."); }
    finally { setBusy(""); }
  }

  if (loading) return <div className="reservation-service-state" role="status"><h2>Vérification de la proposition…</h2><p>Nous vérifions que cette table est toujours disponible.</p></div>;
  if (error && !offer) return <div className="reservation-service-state" role="alert"><h2>Proposition indisponible.</h2><p>{error}</p></div>;
  const reservation = offer?.reservation || {};
  const active = offer?.state === "offered" && new Date(offer?.offerExpiresAt).getTime() > now;
  return <div className="reservation-waitlist">
    <p className="reservation-step-help">{active ? "Une table correspondant à votre demande est disponible. Confirmez-la avant l’expiration de la proposition." : "Cette proposition a déjà été traitée ou n’est plus disponible."}</p>
    <dl className="reservation-review-list">
      <div><dt>Date</dt><dd>{formatPublicReservationDate(reservation.reservationDate)}</dd></div>
      <div><dt>Heure</dt><dd>{reservation.reservationTime || "—"}</dd></div>
      <div><dt>Convives</dt><dd>{reservation.numberOfGuests || "—"} personnes</dd></div>
    </dl>
    {active && offer?.offerExpiresAt ? <p className="reservation-service-feedback">Réponse possible jusqu’au {formatPublicReservationDateTime(offer.offerExpiresAt)}.</p> : null}
    {message ? <p className="reservation-service-feedback" role="status">{message}</p> : null}
    {error ? <p className="reservation-form-error" role="alert">{error}</p> : null}
    {active ? <div className="reservation-manage-buttons"><button type="button" className="button button--rust" onClick={() => respond("accept")} disabled={Boolean(busy)}>{busy === "accept" ? "Confirmation…" : "Accepter la place"}</button><button type="button" className="reservation-back-link" onClick={() => respond("decline")} disabled={Boolean(busy)}>{busy === "decline" ? "Envoi…" : "Refuser"}</button></div> : null}
  </div>;
}
