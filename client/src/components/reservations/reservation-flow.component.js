import { useEffect, useMemo, useState } from "react";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { getMockTimes } from "@/_assets/data/reservation-availability.mock";

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
  const day = date.getDay();
  return dateKey(date) < dateKey(today) || day === 0 || day === 6;
}

export default function ReservationFlow() {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(today));
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState("");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [showValidation, setShowValidation] = useState(false);

  const selectedDateKey = selectedDate ? dateKey(selectedDate) : "";
  const times = useMemo(() => selectedDateKey ? getMockTimes(selectedDateKey, guests) : [], [selectedDateKey, guests]);
  const firstInvalidField = () => document.querySelector(".reservation-customer-form :invalid");

  useEffect(() => {
    if (selectedTime && !times.includes(selectedTime)) setSelectedTime("");
  }, [selectedTime, times]);

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

  function renderCalendar() {
    const currentMonth = monthStart(today);
    return (
      <section className="reservation-calendar" aria-label="Calendrier des disponibilités">
        <div className="reservation-calendar-heading">
          <button
            type="button"
            aria-label="Afficher le mois précédent"
            disabled={visibleMonth <= currentMonth}
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          >
            <ArrowIcon direction="left" size={20} />
          </button>
          <h4 className="reservation-calendar-title">
            {formatDate(visibleMonth, { month: "long", year: "numeric" })}
          </h4>
          <button
            type="button"
            aria-label="Afficher le mois suivant"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
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
            const dayTimes = getMockTimes(key, guests);
            const isDisabled = isClosedDate(date, today);
            const isSelected = key === selectedDateKey;
            const classes = [
              "reservation-calendar-day",
              dayTimes.length ? "has-times" : "no-times",
              isSelected ? "is-selected" : "",
            ].filter(Boolean).join(" ");
            const availabilityLabel = dayTimes.length
              ? `${dayTimes.length} horaires disponibles pour ${guests} ${guests > 1 ? "convives" : "convive"}`
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
        <p className="reservation-calendar-legend"><span aria-hidden="true" /> Horaires disponibles pour {guests} {guests > 1 ? "convives" : "convive"}</p>
      </section>
    );
  }

  function renderStep() {
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
            {!selectedDate ? (
              <p className="reservation-times-prompt">Choisissez une date pour afficher ses horaires.</p>
            ) : times.length ? (
              <div className="reservation-time-list" aria-label={`Horaires disponibles pour ${guests} convives`}>
                {times.map((time) => (
                  <button key={time} type="button" className={selectedTime === time ? "is-selected" : ""} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>{time}</button>
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
        <p className="reservation-preview-notice" role="status">Aucune réservation n’est envoyée ou enregistrée dans cet aperçu.</p>
        <div className="reservation-step-actions">
          <button type="button" className="reservation-back-link" onClick={() => setStep(2)}><ArrowIcon direction="left" size={16} /> Modifier mes coordonnées</button>
          <button type="button" className="button button--rust" disabled title="La connexion au service de réservation sera ajoutée ultérieurement">Confirmation à venir</button>
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
      <div className="reservation-flow-layout page-container">
        <nav className="reservation-progress" aria-label="Étapes de réservation">
          <p className="eyebrow">VOTRE PARCOURS</p>
          <ol>
            {steps.map((label, index) => {
              const number = index + 1;
              const isCurrent = step === number;
              const isComplete = step > number;
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
          <h3>Le Ventadour</h3>
          <div className="reservation-summary-line"><span>Date</span><strong>{selectedDate ? formatDate(selectedDate, { day: "numeric", month: "long" }) : "À choisir"}</strong></div>
          <div className="reservation-summary-line"><span>Heure</span><strong>{selectedTime || "À choisir"}</strong></div>
          <div className="reservation-summary-line"><span>Convives</span><strong>{guests} {guests > 1 ? "personnes" : "personne"}</strong></div>
          <p className="reservation-summary-note">Service du déjeuner</p>
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
