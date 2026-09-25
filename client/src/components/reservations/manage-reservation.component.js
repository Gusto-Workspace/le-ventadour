import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRestaurant } from "@/contexts/restaurant.context";
import { isApiUnavailableError } from "@/_assets/utils/api-errors.utils";
import { getRestaurantContact } from "@/_assets/utils/restaurant-data.utils";
import { formatPublicReservationDate, getReservationEditDate, publicReservationError, reservationStatusLabel } from "@/_assets/utils/reservation-public.utils";
import EditAvailability from "./edit-availability.component";

function Detail({ label, children }) {
  return <div><dt>{label}</dt><dd>{children || "—"}</dd></div>;
}

function ManagementMessage({ title, children, error = false }) {
  return <div className="reservation-service-state" role={error ? "alert" : "status"}><h2>{title}</h2><p>{children}</p><Link href="/contact" className="reservation-back-link">Contacter le restaurant</Link></div>;
}

export default function ManageReservation({ reservationId, manageToken }) {
  const { restaurant, loading: restaurantLoading, apiUrl } = useRestaurant();
  const contact = getRestaurantContact(restaurant);
  const [reservation, setReservation] = useState(null);
  const [management, setManagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [silentlyUnavailable, setSilentlyUnavailable] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [validEdit, setValidEdit] = useState(false);
  const [editData, setEditData] = useState({ reservationDate: "", reservationTime: "", numberOfGuests: "" });
  const setEditValidity = useCallback((value) => setValidEdit(value), []);

  const loadReservation = useCallback(async () => {
    if (!reservationId || !manageToken) { setLoadError("Ce lien de réservation est invalide ou incomplet."); setLoading(false); return; }
    if (!apiUrl) { setSilentlyUnavailable(true); setLoading(false); return; }
    setLoading(true);
    setLoadError("");
    setSilentlyUnavailable(false);
    try {
      const response = await fetch(`${apiUrl}/reservations/${reservationId}?token=${encodeURIComponent(manageToken)}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.reservation) {
        if (response.status >= 500) throw Object.assign(new Error("reservation_api_unavailable"), { apiUnavailable: true });
        throw new Error(publicReservationError(payload, response.status, "Impossible de retrouver cette réservation."));
      }
      setReservation(payload.reservation);
      setManagement(payload.management || null);
    } catch (error) {
      if (isApiUnavailableError(error)) setSilentlyUnavailable(true);
      else setLoadError(error.message || "Impossible de retrouver cette réservation.");
    } finally { setLoading(false); }
  }, [apiUrl, manageToken, reservationId]);

  useEffect(() => { loadReservation(); }, [loadReservation]);

  const linkedRestaurantId = String(reservation?.restaurant_id?._id || reservation?.restaurant_id || "");
  const restaurantMismatch = Boolean(reservation && restaurant?._id && linkedRestaurantId && String(restaurant._id) !== linkedRestaurantId);
  const canModify = management?.canModify === true && !restaurantMismatch;
  const canCancel = management?.canCancel === true && !restaurantMismatch;
  const status = String(reservation?.status || "");

  function startEditing() {
    setEditData({
      reservationDate: getReservationEditDate(reservation?.reservationDate),
      reservationTime: String(reservation?.reservationTime || "").slice(0, 5),
      numberOfGuests: String(reservation?.numberOfGuests || ""),
    });
    setActionError(""); setSuccess(""); setConfirmCancel(false); setEditing(true);
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!canModify || !validEdit || busy) return;
    setBusy(true); setActionError(""); setSuccess("");
    try {
      const response = await fetch(`${apiUrl}/reservations/${reservation._id}?token=${encodeURIComponent(manageToken)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw Object.assign(new Error(publicReservationError(payload, response.status, "Impossible de modifier la réservation.")), { apiUnavailable: response.status >= 500 });
      setReservation(payload.reservation || reservation);
      setManagement(payload.management || null);
      setEditing(false); setConfirmCancel(false);
      setSuccess("Votre réservation a bien été modifiée.");
    } catch (error) {
      if (!isApiUnavailableError(error)) {
        setActionError(error.message || "Impossible de modifier la réservation.");
        setEditData((current) => ({ ...current, reservationTime: "" }));
      }
    } finally { setBusy(false); }
  }

  async function cancelReservation() {
    if (!canCancel || busy) return;
    setBusy(true); setActionError(""); setSuccess("");
    try {
      const response = await fetch(`${apiUrl}/reservations/${reservation._id}/cancel?token=${encodeURIComponent(manageToken)}`, { method: "POST", headers: { "Content-Type": "application/json" } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw Object.assign(new Error(publicReservationError(payload, response.status, "Impossible d’annuler la réservation.")), { apiUnavailable: response.status >= 500 });
      setReservation(payload.reservation || reservation);
      setManagement(payload.management || null);
      setConfirmCancel(false);
      setSuccess("Votre réservation a bien été annulée.");
    } catch (error) {
      if (!isApiUnavailableError(error)) setActionError(error.message || "Impossible d’annuler la réservation.");
    } finally { setBusy(false); }
  }

  if (loading || (reservation && restaurantLoading)) return <ManagementMessage title="Chargement en cours">Nous retrouvons votre réservation.</ManagementMessage>;
  if (silentlyUnavailable) return null;
  if (loadError) return <ManagementMessage title="Réservation introuvable" error>{loadError}</ManagementMessage>;
  if (restaurantMismatch) return <ManagementMessage title="Lien non valide" error>Cette réservation ne correspond pas au restaurant Le Ventadour.</ManagementMessage>;

  return <div className="reservation-manage">
    <div className="reservation-manage-meta"><span>{reservationStatusLabel(status)}</span><small>Réservation #{String(reservation?._id || "").slice(-6).toUpperCase()}</small></div>
    <dl className="reservation-review-list">
      <Detail label="Date">{formatPublicReservationDate(reservation?.reservationDate)}</Detail>
      <Detail label="Heure">{String(reservation?.reservationTime || "").slice(0, 5)}</Detail>
      <Detail label="Convives">{reservation?.numberOfGuests} {Number(reservation?.numberOfGuests) > 1 ? "personnes" : "personne"}</Detail>
      <Detail label="Nom">{reservation?.customerName || `${reservation?.customerFirstName || ""} ${reservation?.customerLastName || ""}`.trim()}</Detail>
      <Detail label="Téléphone">{reservation?.customerPhone}</Detail>
      <Detail label="E-mail">{reservation?.customerEmail}</Detail>
      {reservation?.commentary ? <Detail label="Demande">{reservation.commentary}</Detail> : null}
    </dl>

    {success ? <p className="reservation-service-feedback" role="status">{success}</p> : null}
    {actionError ? <p className="reservation-form-error" role="alert">{actionError}</p> : null}

    {status === "AwaitingBankHold" && management?.reasonCode !== "BANK_HOLD_EXPIRED" ? <div className="reservation-manage-action"><h2>Validation bancaire requise</h2><p>Finalisez l’empreinte bancaire pour confirmer votre venue.</p><Link className="button button--rust" href={`/reservations/${reservationId}/bank-hold`}>Valider ma carte</Link></div> : null}
    {status === "Canceled" ? <div className="reservation-manage-action"><h2>Votre table a bien été libérée.</h2><p>Vous pouvez choisir un nouveau créneau à tout moment.</p><Link className="button button--rust" href="/reservations">Réserver à nouveau</Link></div> : null}

    {status !== "Canceled" && status !== "AwaitingBankHold" ? <div className="reservation-manage-action">
      <h2>Votre réservation</h2>
      {canModify || canCancel ? <>
        {canModify && editing ? <form className="reservation-manage-edit" onSubmit={saveEdit}>
          <EditAvailability apiUrl={apiUrl} manageToken={manageToken} restaurant={restaurant} reservation={reservation} editData={editData} setEditData={setEditData} onValidityChange={setEditValidity} />
          <div className="reservation-step-actions"><button type="button" className="reservation-back-link" onClick={() => setEditing(false)} disabled={busy}>Retour</button><button type="submit" className="button button--rust" disabled={!validEdit || busy}>{busy ? "Enregistrement…" : "Enregistrer les modifications"}</button></div>
        </form> : null}
        {!editing ? <div className="reservation-manage-buttons">{canModify ? <button type="button" className="button button--rust" onClick={startEditing}>Modifier ma réservation</button> : null}{canCancel ? <button type="button" className="reservation-back-link" onClick={() => setConfirmCancel(true)}>Annuler la réservation</button> : null}</div> : null}
        {confirmCancel && canCancel ? <div className="reservation-manage-confirm" role="group" aria-label="Confirmer l’annulation"><p>Confirmez-vous l’annulation ? Cette action est immédiate.</p><div className="reservation-manage-buttons"><button type="button" className="button button--rust" onClick={cancelReservation} disabled={busy}>{busy ? "Annulation…" : "Oui, annuler"}</button><button type="button" className="reservation-back-link" onClick={() => setConfirmCancel(false)} disabled={busy}>Garder ma réservation</button></div></div> : null}
      </> : <p>{management?.reasonMessage || "Cette réservation ne peut plus être gérée en ligne."}</p>}
    </div> : null}
    {contact.phone || contact.email ? <p className="reservation-manage-contact">Besoin d’aide ? {contact.phone ? <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a> : null}{contact.phone && contact.email ? " · " : null}{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}</p> : null}
  </div>;
}
