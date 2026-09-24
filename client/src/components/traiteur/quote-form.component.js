import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";
import ArrowIcon from "@/components/_shared/arrow-icon.component";

export default function QuoteForm() {
  const contact = getRestaurantContact();

  function prepareEmail(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const subject = `Demande de devis traiteur — ${values.eventType}`;
    const body = [
      `Nom : ${values.name}`,
      `Email : ${values.email}`,
      `Téléphone : ${values.phone}`,
      `Événement : ${values.eventType}`,
      `Date envisagée : ${values.date || "À préciser"}`,
      `Lieu : ${values.place || "À préciser"}`,
      `Nombre de convives : ${values.guests || "À préciser"}`,
      "",
      "Votre projet :",
      values.message,
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="quote-form" onSubmit={prepareEmail}>
      <div className="quote-form-row">
        <label>Votre nom <input name="name" autoComplete="name" required /></label>
        <label>Votre email <input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="quote-form-row">
        <label>Téléphone <input name="phone" type="tel" autoComplete="tel" required /></label>
        <label>Votre événement <select name="eventType" defaultValue="" required><option value="" disabled>Choisir une occasion</option><option>Cocktail dînatoire</option><option>Mariage</option><option>Réception privée</option><option>Événement professionnel</option><option>Autre événement</option></select></label>
      </div>
      <div className="quote-form-row quote-form-row--three">
        <label>Date envisagée <input name="date" type="date" /></label>
        <label>Lieu <input name="place" /></label>
        <label>Convives <input name="guests" type="number" min="1" /></label>
      </div>
      <label>Parlez-nous de votre projet <textarea name="message" rows="3" required /></label>
      <div className="quote-form-bottom"><button className="button button--dark" type="submit">Envoyer <span><ArrowIcon size={22} /></span></button></div>
    </form>
  );
}
