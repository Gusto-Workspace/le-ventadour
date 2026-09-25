import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRestaurant } from "@/contexts/restaurant.context";
import { isApiUnavailableError } from "@/_assets/utils/api-errors.utils";

const confirmedStatuses = new Set(["Pending", "Confirmed", "Active", "Late", "Finished"]);

export default function ResumeBankHold({ reservationId }) {
  const router = useRouter();
  const { apiUrl } = useRestaurant();
  const [error, setError] = useState("");
  const [silentlyUnavailable, setSilentlyUnavailable] = useState(false);

  useEffect(() => {
    if (!router.isReady || !reservationId) return;
    if (!apiUrl) { setSilentlyUnavailable(true); return; }
    let active = true;
    async function resume() {
      try {
        const response = await fetch(`${apiUrl}/reservations/${reservationId}/bank-hold/retry`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baseUrl: window.location.origin }),
        });
        const payload = await response.json().catch(() => ({}));
        if (response.status >= 500) { setSilentlyUnavailable(true); return; }
        if (response.ok && payload.url) { window.location.href = payload.url; return; }
        const statusResponse = await fetch(`${apiUrl}/reservations/${reservationId}`);
        const statusPayload = await statusResponse.json().catch(() => ({}));
        if (statusResponse.status >= 500) { setSilentlyUnavailable(true); return; }
        const status = statusPayload?.reservation?.status;
        if (statusResponse.ok && confirmedStatuses.has(status)) {
          localStorage.removeItem("gm_pending_bank_hold");
          await router.replace(`/reservations?confirmation=${encodeURIComponent(reservationId)}&bankHold=success`);
          return;
        }
        if (["Canceled", "Rejected", "NoShow"].includes(status)) localStorage.removeItem("gm_pending_bank_hold");
        if (active) setError(response.status === 404 ? "Cette réservation est introuvable." : String(payload.message || "").toLowerCase().includes("expir") ? "Le délai de validation de cette réservation a expiré." : "La validation ne peut plus être relancée. Contactez le restaurant.");
      } catch (requestError) {
        if (!active) return;
        if (isApiUnavailableError(requestError)) setSilentlyUnavailable(true);
        else setError("Impossible de relancer la validation. Réessayez ou contactez le restaurant.");
      }
    }
    resume();
    return () => { active = false; };
  }, [apiUrl, reservationId, router, router.isReady]);

  if (silentlyUnavailable) return null;
  if (error) return <div className="reservation-service-state" role="alert"><h2>Validation indisponible.</h2><p>{error}</p><div className="reservation-manage-buttons"><Link className="button button--rust" href="/reservations">Nouvelle réservation</Link><Link className="reservation-back-link" href="/contact">Nous contacter</Link></div></div>;
  return <div className="reservation-service-state" role="status"><h2>Reprise de votre réservation…</h2><p>Nous vérifions son état avant de vous rediriger vers l’étape nécessaire.</p></div>;
}
