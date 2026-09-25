import { useEffect, useMemo, useState } from "react";
import {
  formatReservationDateForApi,
  getReservationTimeOptions,
  getServiceBucketFromTime,
  isReservationDateClosed,
} from "@/_assets/utils/reservations.utils";

export default function EditAvailability({ apiUrl, manageToken, restaurant, reservation, editData, setEditData, onValidityChange }) {
  const [meal, setMeal] = useState(() => getServiceBucketFromTime(reservation?.reservationTime));
  const [availability, setAvailability] = useState({ reservations: [], slotCoverUsage: [], serviceCoverUsage: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAvailability() {
      if (!apiUrl || !manageToken || !restaurant?._id || !reservation?._id || !editData.reservationDate) {
        if (active) { setLoading(false); setError(true); }
        return;
      }
      setLoading(true);
      setError("");
      try {
        const date = formatReservationDateForApi(editData.reservationDate);
        const query = new URLSearchParams({ excludeReservationId: String(reservation._id), token: manageToken, from: date, to: date });
        const response = await fetch(`${apiUrl}/public/restaurants/${restaurant._id}/reservations?${query}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error("availability_unavailable");
        if (active) setAvailability({
          reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
          slotCoverUsage: Array.isArray(payload.slotCoverUsage) ? payload.slotCoverUsage : [],
          serviceCoverUsage: Array.isArray(payload.serviceCoverUsage) ? payload.serviceCoverUsage : [],
        });
      } catch {
        if (active) { setAvailability({ reservations: [], slotCoverUsage: [], serviceCoverUsage: [] }); setError(true); }
      } finally { if (active) setLoading(false); }
    }
    loadAvailability();
    return () => { active = false; };
  }, [apiUrl, editData.reservationDate, manageToken, restaurant?._id, reservation?._id]);

  const timeOptions = useMemo(() => getReservationTimeOptions({
    reservationDate: editData.reservationDate,
    numberOfGuests: editData.numberOfGuests,
    restaurant,
    reservationsList: availability.reservations,
    slotCoverUsage: availability.slotCoverUsage,
    serviceCoverUsage: availability.serviceCoverUsage,
    excludeReservationId: reservation?._id,
  }).filter((option) => option.type === "available" && getServiceBucketFromTime(option.time) === meal), [availability, editData.numberOfGuests, editData.reservationDate, meal, reservation?._id, restaurant]);
  const valid = !loading && !error && timeOptions.some((option) => option.time === editData.reservationTime);

  useEffect(() => { onValidityChange(valid); }, [onValidityChange, valid]);

  function changeDate(event) {
    const value = event.target.value;
    setEditData((current) => ({ ...current, reservationDate: value, reservationTime: "" }));
  }
  function changeGuests(delta) {
    setEditData((current) => ({ ...current, numberOfGuests: String(Math.min(12, Math.max(1, Number(current.numberOfGuests || 1) + delta))), reservationTime: "" }));
  }

  return <div className="reservation-edit-availability">
    <p className="reservation-control-label">NOMBRE DE CONVIVES</p>
    <div className="reservation-guest-picker">
      <button type="button" aria-label="Retirer une personne" onClick={() => changeGuests(-1)}>−</button>
      <p><strong>{editData.numberOfGuests}</strong><span>{Number(editData.numberOfGuests) > 1 ? "personnes" : "personne"}</span></p>
      <button type="button" aria-label="Ajouter une personne" onClick={() => changeGuests(1)}>+</button>
    </div>
    <label className="reservation-field"><span>Choisir une date</span><input type="date" value={editData.reservationDate} min={formatReservationDateForApi(new Date())} onChange={changeDate} required /></label>
    {editData.reservationDate && isReservationDateClosed({ reservationDate: editData.reservationDate, restaurant }) ? <p className="reservation-form-error">Le restaurant est fermé à cette date.</p> : null}
    <div className="reservation-edit-meals" aria-label="Service"><button type="button" className={meal === "lunch" ? "is-selected" : ""} aria-pressed={meal === "lunch"} onClick={() => { setMeal("lunch"); setEditData((current) => ({ ...current, reservationTime: "" })); }}>Déjeuner</button><button type="button" className={meal === "dinner" ? "is-selected" : ""} aria-pressed={meal === "dinner"} onClick={() => { setMeal("dinner"); setEditData((current) => ({ ...current, reservationTime: "" })); }}>Dîner</button></div>
    <p className="reservation-control-label">HORAIRES DISPONIBLES</p>
    {loading ? <p role="status">Recherche des horaires…</p> : error ? null : timeOptions.length ? <div className="reservation-time-list">{timeOptions.map((option) => <button key={option.time} type="button" className={editData.reservationTime === option.time ? "is-selected" : ""} aria-pressed={editData.reservationTime === option.time} onClick={() => setEditData((current) => ({ ...current, reservationTime: option.time }))}>{option.time}</button>)}</div> : <p className="reservation-empty-times" role="status">Aucun horaire disponible pour ce service et ce nombre de convives.</p>}
  </div>;
}
