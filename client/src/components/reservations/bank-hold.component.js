import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRestaurant } from "@/contexts/restaurant.context";
import { isApiUnavailableError } from "@/_assets/utils/api-errors.utils";

const CONFIRMED_STATUSES = new Set(["Pending", "Confirmed", "Active", "Late", "Finished"]);
const getConfirmationUrl = (id) => `/reservations?confirmation=${encodeURIComponent(id)}&bankHold=success`;

function BankHoldForm({ apiUrl, reservationId, data }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const processedIntent = useRef("");

  const finalize = useCallback(async (intentType, intentId) => {
    const response = await fetch(`${apiUrl}/reservations/${reservationId}/bank-hold/finalize-public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intentType, intentId }),
    });
    if (!response.ok) throw Object.assign(new Error("finalize_failed"), { apiUnavailable: response.status >= 500 });
    localStorage.removeItem("gm_pending_bank_hold");
    setComplete(true);
  }, [apiUrl, reservationId]);

  useEffect(() => {
    if (!router.isReady || complete || busy) return;
    const setupIntent = Array.isArray(router.query.setup_intent) ? router.query.setup_intent[0] : router.query.setup_intent;
    const paymentIntent = Array.isArray(router.query.payment_intent) ? router.query.payment_intent[0] : router.query.payment_intent;
    const intentId = setupIntent || paymentIntent;
    if (!intentId || processedIntent.current === intentId) return;
    processedIntent.current = intentId;
    setBusy(true);
    finalize(setupIntent ? "setup" : "payment", intentId)
      .catch((error) => { if (!isApiUnavailableError(error)) setError("La validation de votre carte n’a pas pu être finalisée. Réessayez ou contactez le restaurant."); })
      .finally(() => setBusy(false));
  }, [busy, complete, finalize, router.isReady, router.query.payment_intent, router.query.setup_intent]);

  useEffect(() => {
    if (!complete) return undefined;
    const timeout = window.setTimeout(() => router.replace(getConfirmationUrl(reservationId)), 1200);
    return () => window.clearTimeout(timeout);
  }, [complete, reservationId, router]);

  async function submit(event) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");
    try {
      const returnUrl = `${window.location.origin}/reservations/${reservationId}/bank-hold`;
      const result = data.intentType === "setup"
        ? await stripe.confirmSetup({ elements, redirect: "if_required", confirmParams: { return_url: returnUrl } })
        : await stripe.confirmPayment({ elements, redirect: "if_required", confirmParams: { return_url: returnUrl } });
      if (result.error) throw new Error("payment_failed");
      const intentId = result.setupIntent?.id || result.paymentIntent?.id;
      if (!intentId) throw new Error("payment_incomplete");
      await finalize(data.intentType, intentId);
    } catch (error) {
      if (!isApiUnavailableError(error)) setError("La carte n’a pas pu être validée. Vérifiez les informations et réessayez.");
    } finally {
      setBusy(false);
    }
  }

  if (complete) return <div className="reservation-step-content" role="status"><p className="eyebrow reservation-step-eyebrow">VALIDATION TERMINÉE</p><h2>Merci.</h2><p>La validation de votre carte est enregistrée. Vous allez retrouver le suivi de votre réservation.</p></div>;

  return <form className="reservation-customer-form reservation-bank-hold" onSubmit={submit}>
    <p className="reservation-step-help">{data.flow === "scheduled" ? "Votre carte est enregistrée de façon sécurisée pour garantir votre réservation. Aucun débit immédiat n’est effectué." : "Une empreinte bancaire sécurisée est nécessaire pour garantir votre réservation. Le montant n’est pas débité."}</p>
    {Number(data.amountTotal) > 0 && <p className="reservation-step-help">Montant de la garantie : {Number(data.amountTotal).toFixed(2)} €</p>}
    <div className="reservation-payment-element"><PaymentElement options={{ wallets: { link: "never" } }} /></div>
    {error && <p className="reservation-form-error" role="alert">{error}</p>}
    <div className="reservation-step-actions"><button className="button button--rust" type="submit" disabled={!stripe || !elements || busy}>{busy ? "Validation…" : "Valider la carte"}</button></div>
    <p className="reservation-step-help">Paiement sécurisé par Stripe. Vos données bancaires ne transitent pas par le restaurant.</p>
  </form>;
}

export default function BankHold({ reservationId }) {
  const { apiUrl } = useRestaurant();
  const [prepared, setPrepared] = useState(null);
  const [error, setError] = useState("");
  const [silentlyUnavailable, setSilentlyUnavailable] = useState(false);
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => stripeKey ? loadStripe(stripeKey) : null, [stripeKey]);

  useEffect(() => {
    let active = true;
    async function prepare() {
      try {
        if (!reservationId || !apiUrl || !stripeKey) { setSilentlyUnavailable(true); return; }
        const response = await fetch(`${apiUrl}/reservations/${reservationId}/bank-hold/prepare`, { method: "POST", headers: { "Content-Type": "application/json" } });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status >= 500) { setSilentlyUnavailable(true); return; }
          const statusResponse = await fetch(`${apiUrl}/reservations/${reservationId}`).catch(() => null);
          if (!statusResponse || statusResponse.status >= 500) { setSilentlyUnavailable(true); return; }
          const statusPayload = statusResponse ? await statusResponse.json().catch(() => ({})) : {};
          if (CONFIRMED_STATUSES.has(statusPayload?.reservation?.status)) {
            localStorage.removeItem("gm_pending_bank_hold");
            window.location.replace(getConfirmationUrl(reservationId));
            return;
          }
          if (statusResponse?.status === 404) throw new Error("Cette réservation est introuvable.");
          if (statusPayload?.management?.reasonCode === "BANK_HOLD_EXPIRED" || String(payload?.message || "").toLowerCase().includes("expir")) throw new Error("Le délai de validation de cette réservation a expiré. Contactez le restaurant.");
          if (statusPayload?.reservation?.status === "Canceled") throw new Error("Cette réservation a déjà été annulée.");
          throw new Error("La validation bancaire ne peut pas être préparée pour le moment. Réessayez ou contactez le restaurant.");
        }
        if (active) setPrepared(payload);
      } catch (requestError) {
        if (!active) return;
        if (isApiUnavailableError(requestError)) setSilentlyUnavailable(true);
        else setError(requestError.message || "La validation bancaire ne peut pas être préparée pour le moment. Réessayez ou contactez le restaurant.");
      }
    }
    prepare();
    return () => { active = false; };
  }, [apiUrl, reservationId, stripeKey]);

  if (silentlyUnavailable) return null;
  if (error) return <div className="reservation-step-content" role="alert"><p className="eyebrow reservation-step-eyebrow">RÉSERVATION</p><h2>Validation non finalisée.</h2><p>{error}</p><a className="reservation-back-link" href="/reservations">Retour aux réservations</a></div>;
  if (!prepared || !stripePromise) return <div className="reservation-step-content" role="status"><p className="eyebrow reservation-step-eyebrow">RÉSERVATION</p><h2>Préparation sécurisée…</h2><p>Nous préparons la validation de votre carte.</p></div>;
  return <Elements stripe={stripePromise} options={{ clientSecret: prepared.clientSecret }}><BankHoldForm apiUrl={apiUrl} reservationId={prepared.reservationId || reservationId} data={prepared} /></Elements>;
}
