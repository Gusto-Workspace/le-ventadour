import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import {
  formatReservationDateForApi,
  getReservationParameters,
  getReservationTimeOptions,
  isReservationDateClosed,
} from "@/_assets/utils/reservations.utils";

const steps = ["Disponibilités", "Vos informations", "Récapitulatif"];
const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const emptyCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  commentary: "",
};

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDate(date, options) {
  return date.toLocaleDateString("fr-FR", options);
}

function getCalendarDates(month) {
  const firstDay = monthStart(month);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
  ];
}

function isClosedDate(date, today) {
  return dateKey(date) < dateKey(today);
}

export default function ReservationFlow() {
  const router = useRouter();
  const { restaurant, loading: restaurantLoading, error: restaurantError, apiUrl } = useRestaurant();
  const today = new Date();
  const [step, setStep] = useState(1);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(today));
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState("");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [showValidation, setShowValidation] = useState(false);
  const [availability, setAvailability] = useState({ reservations: [], slotCoverUsage: [], serviceCoverUsage: [] });
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pendingBankHold, setPendingBankHold] = useState(null);
  const [pendingHoldError, setPendingHoldError] = useState("");
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationError, setConfirmationError] = useState("");
  const [idempotencyKey] = useState(() => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `resa_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const reservationParameters = getReservationParameters(restaurant);
  const hasReservations = restaurant?.options?.reservations !== false;

  const monthRange = useMemo(() => {
    const from = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const to = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
    return { from: formatReservationDateForApi(from), to: formatReservationDateForApi(to) };
  }, [visibleMonth]);

  const loadAvailability = useCallback(async () => {
    if (restaurantLoading) return;
    if (!restaurant?._id || !apiUrl) {
      setAvailabilityLoading(false);
      setAvailabilityError(true);
      return;
    }
    setAvailabilityLoading(true);
    setAvailabilityError(false);
    try {
      const query = new URLSearchParams(monthRange);
      const response = await fetch(`${apiUrl}/public/restaurants/${restaurant._id}/reservations?${query}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error("availability_unavailable");
      setAvailability({
        reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
        slotCoverUsage: Array.isArray(payload.slotCoverUsage) ? payload.slotCoverUsage : [],
        serviceCoverUsage: Array.isArray(payload.serviceCoverUsage) ? payload.serviceCoverUsage : [],
      });
    } catch (requestError) {
      console.error("Reservation availability could not be loaded.", requestError);
      setAvailability({ reservations: [], slotCoverUsage: [], serviceCoverUsage: [] });
      setAvailabilityError(true);
    } finally {
      setAvailabilityLoading(false);
    }
  }, [apiUrl, monthRange, restaurant?._id, restaurantLoading]);

  useEffect(() => { loadAvailability(); }, [loadAvailability]);

  useEffect(() => {
    if (!apiUrl || !restaurant?._id) return;
    async function restorePendingBankHold() {
      try {
        const stored = JSON.parse(localStorage.getItem("gm_pending_bank_hold") || "null");
        if (!stored?.reservationId || String(stored.restaurantId) !== String(restaurant._id)) return;
        const response = await fetch(`${apiUrl}/reservations/${stored.reservationId}`);
        const payload = await response.json().catch(() => ({}));
        const reservation = payload?.reservation;
        const expiresAt = reservation?.bankHold?.expiresAt ? new Date(reservation.bankHold.expiresAt).getTime() : null;
        if (!response.ok || reservation?.status !== "AwaitingBankHold" || !reservation?.bankHold?.enabled || (expiresAt && expiresAt <= Date.now())) {
          localStorage.removeItem("gm_pending_bank_hold");
          return;
        }
        setPendingBankHold({
          reservationId: String(reservation._id),
          date: reservation.reservationDate || stored.reservationDate,
          time: String(reservation.reservationTime || stored.reservationTime || "").slice(0, 5),
          guests: reservation.numberOfGuests || stored.numberOfGuests,
        });
      } catch {
        localStorage.removeItem("gm_pending_bank_hold");
      }
    }
    restorePendingBankHold();
  }, [apiUrl, restaurant?._id]);

  useEffect(() => {
    if (!router.isReady || !apiUrl) return;
    const reservationId = Array.isArray(router.query.confirmation) ? router.query.confirmation[0] : router.query.confirmation;
    const bankHold = Array.isArray(router.query.bankHold) ? router.query.bankHold[0] : router.query.bankHold;
    if (!reservationId) {
      if (bankHold === "failed" || bankHold === "canceled") setConfirmationError("La validation de votre carte n’a pas abouti. Vous pouvez recommencer votre demande ou contacter le restaurant.");
      return;
    }
    let active = true;
    setConfirmationLoading(true);
    fetch(`${apiUrl}/reservations/${reservationId}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload?.reservation) throw new Error("confirmation_unavailable");
        if (!active) return;
        const reservation = payload.reservation;
        setReservationStatus(String(reservation.status || ""));
        const date = String(reservation.reservationDate || "").slice(0, 10).split("-").map(Number);
        if (date.length === 3 && date.every(Number.isFinite)) setSelectedDate(new Date(date[0], date[1] - 1, date[2]));
        setSelectedTime(String(reservation.reservationTime || "").slice(0, 5));
        setGuests(Number(reservation.numberOfGuests) || 2);
        setCustomer({
          firstName: reservation.customerFirstName || "",
          lastName: reservation.customerLastName || "",
          email: reservation.customerEmail || "",
          phone: reservation.customerPhone || "",
          commentary: reservation.commentary || "",
        });
        setSubmitted(true);
        setStep(3);
        setConfirmationError("");
        localStorage.removeItem("gm_pending_bank_hold");
        router.replace("/reservations", undefined, { shallow: true });
      })
      .catch(() => { if (active) setConfirmationError("Nous n’avons pas pu vérifier le retour de votre réservation. Contactez le restaurant si vous avez déjà validé votre carte."); })
      .finally(() => { if (active) setConfirmationLoading(false); });
    return () => { active = false; };
  }, [apiUrl, router, router.isReady, router.query.bankHold, router.query.confirmation]);

  const selectedDateKey = selectedDate ? dateKey(selectedDate) : "";
  const getTimesForDate = useCallback((date) => getReservationTimeOptions({
    reservationDate: date,
    numberOfGuests: String(guests),
    restaurant,
    reservationsList: availability.reservations,
    slotCoverUsage: availability.slotCoverUsage,
    serviceCoverUsage: availability.serviceCoverUsage,
  }), [availability, guests, restaurant]);
  const times = useMemo(() => selectedDate ? getTimesForDate(selectedDate) : [], [getTimesForDate, selectedDate]);
  const firstInvalidField = () => document.querySelector(".reservation-customer-form :invalid");

  useEffect(() => {
    if (!submitted && selectedTime && !times.some((option) => option.time === selectedTime)) setSelectedTime("");
  }, [selectedTime, submitted, times]);

  function chooseDate(date) {
    setSelectedDate(date);
    setSelectedTime("");
  }

  function changeGuests(nextGuests) {
    if (nextGuests === guests) return;
    setGuests(nextGuests);
    setSelectedTime("");
  }

  function updateCustomer(event) {
    setCustomer((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submitCustomer(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setShowValidation(true);
      firstInvalidField()?.focus();
      return;
    }
    setShowValidation(false);
    setStep(3);
  }

  async function submitReservation() {
    if (!restaurant?._id || !apiUrl || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmissionError("");
    try {
      const selectedOption = times.find((option) => option.time === selectedTime);
      if (!selectedOption) throw new Error("slot_unavailable");
      const endpoint = selectedOption.type === "waitlist"
        ? `${apiUrl}/restaurants/${restaurant._id}/reservations/waitlist`
        : `${apiUrl}/restaurants/${restaurant._id}/reservations`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationDate: formatReservationDateForApi(selectedDate),
          reservationTime: selectedTime,
          numberOfGuests: String(guests),
          customerFirstName: customer.firstName.trim(),
          customerLastName: customer.lastName.trim(),
          customerEmail: customer.email.trim(),
          customerPhone: customer.phone.trim(),
          commentary: customer.commentary,
          table: reservationParameters.manage_disponibilities ? "auto" : undefined,
          returnUrl: `${window.location.origin}/reservations`,
          idempotencyKey,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error("create_failed");
      if (payload.requiresAction && !payload.redirectUrl) throw new Error("bank_hold_redirect_missing");
      if (payload.requiresAction && payload.redirectUrl) {
        localStorage.setItem("gm_pending_bank_hold", JSON.stringify({
          reservationId: String(payload.reservationId || payload.reservation?._id || ""),
          restaurantId: String(restaurant._id),
          reservationDate: formatReservationDateForApi(selectedDate),
          reservationTime: selectedTime,
          numberOfGuests: String(guests),
          customerFirstName: customer.firstName.trim(),
        }));
        window.location.assign(payload.redirectUrl);
        return;
      }
      setReservationStatus(payload?.reservation?.status || (selectedOption.type === "waitlist" ? "Waitlist" : reservationParameters.auto_accept ? "Confirmed" : "Pending"));
      setSubmitted(true);
      await loadAvailability();
    } catch (requestError) {
      console.error("Reservation could not be created.", requestError);
      setSubmissionError("Votre demande n’a pas pu être envoyée. Vérifiez les informations et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelPendingBankHold() {
    if (!pendingBankHold?.reservationId) return;
    setPendingHoldError("");
    try {
      const response = await fetch(`${apiUrl}/reservations/${pendingBankHold.reservationId}/cancel-pending-bank-hold`, { method: "POST", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("cancel_failed");
      localStorage.removeItem("gm_pending_bank_hold");
      setPendingBankHold(null);
      await loadAvailability();
    } catch {
      setPendingHoldError("La réservation en attente n’a pas pu être annulée. Réessayez.");
    }
  }

  function renderCalendar() {
    const currentMonth = monthStart(today);
    return (
      <section className="reservation-calendar" aria-label="Calendrier des disponibilités">
        <div className="reservation-calendar-heading">
          <button
            type="button"
            aria-label="Afficher le mois précédent"
            disabled={visibleMonth <= currentMonth}
            onClick={() => { setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)); setSelectedDate(null); setSelectedTime(""); }}
          >
            <ArrowIcon direction="left" size={20} />
          </button>
          <h4 className="reservation-calendar-title">
            {formatDate(visibleMonth, { month: "long", year: "numeric" })}
          </h4>
          <button
            type="button"
            aria-label="Afficher le mois suivant"
            onClick={() => { setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)); setSelectedDate(null); setSelectedTime(""); }}
          >
            <ArrowIcon direction="right" size={20} />
          </button>
        </div>
        <div className="reservation-calendar-grid">
          {weekdays.map((weekday) => (
            <span key={weekday} className="reservation-calendar-weekday">{weekday}</span>
          ))}
          {getCalendarDates(visibleMonth).map((date, index) => {
            if (!date) return <span key={`empty-${index}`} className="reservation-calendar-empty" aria-hidden="true" />;
            const key = dateKey(date);
            const dayTimes = getTimesForDate(date);
            const isDisabled = !hasReservations || isClosedDate(date, today) || isReservationDateClosed({ reservationDate: date, restaurant }) || availabilityLoading || availabilityError;
            const isSelected = key === selectedDateKey;
            const classes = [
              "reservation-calendar-day",
              dayTimes.length ? "has-times" : "no-times",
              isSelected ? "is-selected" : "",
            ].filter(Boolean).join(" ");
            const availableCount = dayTimes.filter((option) => option.type === "available").length;
            const waitlistCount = dayTimes.filter((option) => option.type === "waitlist").length;
            const availabilityLabel = dayTimes.length
              ? `${availableCount ? `${availableCount} horaires disponibles` : "aucun horaire disponible"}${waitlistCount ? `, ${waitlistCount} possibilités en liste d’attente` : ""} pour ${guests} ${guests > 1 ? "convives" : "convive"}`
              : `aucun horaire disponible pour ${guests} ${guests > 1 ? "convives" : "convive"}`;
            return (
              <button
                key={key}
                type="button"
                className={classes}
                aria-label={`${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}, ${availabilityLabel}`}
                aria-pressed={isSelected}
                disabled={isDisabled}
                onClick={() => chooseDate(date)}
              >
                <span>{date.getDate()}</span>
                {dayTimes.length ? <i aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
        {availabilityLoading ? <p className="reservation-calendar-legend" role="status">Recherche des disponibilités…</p> : availabilityError ? <p className="reservation-form-error" role="alert">Les disponibilités ne peuvent pas être chargées. <button type="button" onClick={loadAvailability}>Réessayer</button></p> : <p className="reservation-calendar-legend"><span aria-hidden="true" /> Horaires disponibles pour {guests} {guests > 1 ? "convives" : "convive"}</p>}
      </section>
    );
  }

  function renderStep() {
    if (submitted) {
      const confirmed = ["Confirmed", "Active", "Late", "Finished"].includes(reservationStatus);
      const waitlisted = reservationStatus === "Waitlist";
      const title = waitlisted ? "Vous êtes sur liste d’attente." : confirmed ? "Votre table est réservée." : "Merci pour votre demande.";
      const statusText = waitlisted ? "Votre demande a été ajoutée à la liste d’attente du restaurant." : confirmed ? "Votre réservation est confirmée." : "Votre demande a bien été envoyée. Le restaurant vous confirmera votre table.";
      return <div className="reservation-step-content reservation-confirmation-preview" role="status"><p className="eyebrow reservation-step-eyebrow">DEMANDE ENVOYÉE</p><h3>{title}</h3><p className="reservation-step-help">{statusText}</p><dl className="reservation-review-list"><div><dt>Date</dt><dd>{selectedDate ? formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"}</dd></div><div><dt>Heure</dt><dd>{selectedTime}</dd></div><div><dt>Convives</dt><dd>{guests} {guests > 1 ? "personnes" : "personne"}</dd></div></dl></div>;
    }
    if (step === 1) {
      return (
        <div className="reservation-step-content">
          <p className="eyebrow reservation-step-eyebrow">ÉTAPE 01</p>
          <div className="reservation-guest-picker">
            <button type="button" aria-label="Retirer une personne" disabled={guests <= 1} onClick={() => changeGuests(Math.max(1, guests - 1))}>−</button>
            <p aria-live="polite"><strong>{guests}</strong><span>{guests > 1 ? "personnes" : "personne"}</span></p>
            <button type="button" aria-label="Ajouter une personne" disabled={guests >= 12} onClick={() => changeGuests(Math.min(12, guests + 1))}>+</button>
          </div>
          <p className="reservation-guest-note">Pour plus de 12 convives, contactez directement le restaurant.</p>

          <div className="reservation-availability-calendar">
            <p className="eyebrow reservation-control-label">CHOISIR UNE DATE</p>
            {renderCalendar()}
          </div>

          <div className="reservation-availability-times">
            <p className="eyebrow reservation-control-label">HORAIRES DISPONIBLES</p>
            {availabilityError ? (
              <p className="reservation-form-error" role="alert">Impossible de vérifier les créneaux. Vous pouvez réessayer.</p>
            ) : !selectedDate ? (
              <p className="reservation-times-prompt">Choisissez une date pour afficher ses horaires.</p>
            ) : times.length ? (
              <div className="reservation-time-list" aria-label={`Horaires disponibles pour ${guests} convives`}>
              {times.map(({ time, type }) => (
                <button key={time} type="button" className={`${selectedTime === time ? "is-selected" : ""}${type === "waitlist" ? " is-waitlist" : ""}`} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>{type === "waitlist" ? `Liste d’attente · ${time}` : time}</button>
                ))}
              </div>
            ) : (
              <div className="reservation-empty-times" role="status">
                <p>Aucun horaire disponible pour cette date et ce nombre de convives.</p>
              </div>
            )}
          </div>

          <div className="reservation-step-actions">
            {selectedDate && selectedTime ? <span>{formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long" })} · {selectedTime}</span> : null}
            <button type="button" className="button button--rust" disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}>Continuer <span><ArrowIcon direction="right" size={22} /></span></button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="reservation-step-content">
          <p className="eyebrow reservation-step-eyebrow">ÉTAPE 02</p>
          <h3>Vos coordonnées</h3>
          <p className="reservation-step-help">Votre sélection : {selectedDate ? formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long" }) : "date à choisir"} à {selectedTime || "horaire à choisir"}, pour {guests} {guests > 1 ? "personnes" : "personne"}.</p>
          <form className="reservation-customer-form" noValidate onSubmit={submitCustomer}>
            <div className="reservation-customer-grid">
              <BookingField label="Prénom" name="firstName" value={customer.firstName} onChange={updateCustomer} autoComplete="given-name" required showValidation={showValidation} />
              <BookingField label="Nom" name="lastName" value={customer.lastName} onChange={updateCustomer} autoComplete="family-name" required showValidation={showValidation} />
              <BookingField label="E-mail" name="email" type="email" value={customer.email} onChange={updateCustomer} autoComplete="email" required showValidation={showValidation} />
              <BookingField label="Téléphone" name="phone" type="tel" value={customer.phone} onChange={updateCustomer} autoComplete="tel" required showValidation={showValidation} />
            </div>
            <label className="reservation-field reservation-field--commentary">
              <span>Commentaire / demande particulière</span>
              <textarea name="commentary" value={customer.commentary} onChange={updateCustomer} rows="3" placeholder="Allergie, accessibilité, anniversaire…" />
            </label>
            {showValidation ? <p className="reservation-form-error" role="alert">Vérifiez les champs obligatoires et le format de votre adresse e-mail.</p> : null}
            <div className="reservation-step-actions">
              <button type="button" className="reservation-back-link" onClick={() => setStep(1)}><ArrowIcon direction="left" size={16} /> Modifier les disponibilités</button>
              <button type="submit" className="button button--rust">Voir le récapitulatif <span><ArrowIcon direction="right" size={22} /></span></button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="reservation-step-content reservation-confirmation-preview">
        <p className="eyebrow reservation-step-eyebrow">ÉTAPE 03</p>
        <h3>Votre récapitulatif</h3>
        <p className="reservation-step-help">Vérifiez les détails de votre demande.</p>
        <dl className="reservation-review-list">
          <div><dt>Date</dt><dd>{selectedDate ? formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"}</dd></div>
          <div><dt>Heure</dt><dd>{selectedTime || "—"}</dd></div>
          <div><dt>Convives</dt><dd>{guests} {guests > 1 ? "personnes" : "personne"}</dd></div>
          <div><dt>Nom</dt><dd>{customer.firstName} {customer.lastName}</dd></div>
          <div><dt>E-mail</dt><dd>{customer.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{customer.phone}</dd></div>
          <div><dt>Commentaire</dt><dd>{customer.commentary.trim() || "Aucun"}</dd></div>
        </dl>
        {submissionError ? <p className="reservation-form-error" role="alert">{submissionError}</p> : null}
        <div className="reservation-step-actions">
          <button type="button" className="reservation-back-link" onClick={() => setStep(2)}><ArrowIcon direction="left" size={16} /> Modifier mes coordonnées</button>
          <button type="button" className="button button--rust" disabled={submitting || !hasReservations} onClick={submitReservation}>{submitting ? "Envoi…" : "Confirmer la demande"} <span><ArrowIcon direction="right" size={22} /></span></button>
        </div>
        <button type="button" className="reservation-back-link" onClick={() => setStep(1)}><ArrowIcon direction="left" size={16} /> Modifier mes disponibilités</button>
        <button type="button" className="reservation-reset-link" onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(""); setGuests(2); setCustomer(emptyCustomer); setShowValidation(false); }}>Recommencer une demande</button>
      </div>
    );
  }

  return (
    <section id="reservation" className="reservation-flow" aria-labelledby="reservation-flow-title">
      <div className="reservation-flow-heading page-container">
        <p className="eyebrow interior-eyebrow">VOTRE RÉSERVATION</p>
        <h2 id="reservation-flow-title">Une table,<br /><em>à votre rythme.</em></h2>
        <p>Choisissez votre date et préparez votre venue en quelques étapes.</p>
      </div>
      {confirmationLoading ? <p className="api-data-message page-container" role="status">Vérification de votre réservation…</p> : null}
      {confirmationError ? <p className="api-data-message page-container" role="alert">{confirmationError}</p> : null}
      {pendingBankHold ? <div className="api-data-message page-container reservation-pending-hold" role="status"><p>Une validation bancaire est en attente pour votre réservation ({pendingBankHold.date ? formatDate(new Date(pendingBankHold.date), { day: "numeric", month: "long" }) : "date à confirmer"} · {pendingBankHold.time} · {pendingBankHold.guests} convives).</p><Link href={`/reservations/${pendingBankHold.reservationId}/bank-hold`}>Reprendre la validation</Link><button type="button" onClick={cancelPendingBankHold}>Annuler la réservation</button>{pendingHoldError && <p role="alert">{pendingHoldError}</p>}</div> : null}
      {restaurantError ? <p className="api-data-message page-container" role="alert">Les informations du restaurant ne sont pas disponibles pour le moment.</p> : null}
      {!restaurantLoading && restaurant && !hasReservations ? <p className="api-data-message page-container" role="status">La réservation en ligne n’est pas disponible actuellement. Contactez directement le restaurant.</p> : null}
      <div className="reservation-flow-layout page-container">
        <nav className="reservation-progress" aria-label="Étapes de réservation">
          <p className="eyebrow">VOTRE PARCOURS</p>
          <ol>
            {steps.map((label, index) => {
              const number = index + 1;
              const isCurrent = submitted ? number === 3 : step === number;
              const isComplete = submitted || step > number;
              return (
                <li key={label} className={isCurrent ? "is-current" : isComplete ? "is-complete" : ""}>
                  <button
                    type="button"
                    aria-label={`Étape ${number} : ${label}`}
                    aria-current={isCurrent ? "step" : undefined}
                    disabled={number > step}
                    onClick={() => setStep(number)}
                  >
                    <span className="reservation-progress-number">0{number}</span>
                    <span className="reservation-progress-label">{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="reservation-step-panel">
          {renderStep()}
        </div>

        <aside className="reservation-summary" aria-label="Récapitulatif de la sélection">
          <p className="eyebrow">VOTRE TABLE</p>
          <h3>{restaurant?.name || "Le Ventadour"}</h3>
          <div className="reservation-summary-line"><span>Date</span><strong>{selectedDate ? formatDate(selectedDate, { day: "numeric", month: "long" }) : "À choisir"}</strong></div>
          <div className="reservation-summary-line"><span>Heure</span><strong>{selectedTime || "À choisir"}</strong></div>
          <div className="reservation-summary-line"><span>Convives</span><strong>{guests} {guests > 1 ? "personnes" : "personne"}</strong></div>
          {selectedDate && isReservationDateClosed({ reservationDate: selectedDate, restaurant }) ? <p className="reservation-summary-note">Le restaurant est fermé à cette date.</p> : null}
        </aside>
      </div>
    </section>
  );
}

function BookingField({ label, name, value, onChange, type = "text", showValidation, ...props }) {
  const invalid = showValidation && (!value.trim() || (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)));
  return (
    <label className="reservation-field">
      <span>{label} <i aria-hidden="true">*</i></span>
      <input name={name} type={type} value={value} onChange={onChange} aria-invalid={invalid || undefined} {...props} />
    </label>
  );
}
