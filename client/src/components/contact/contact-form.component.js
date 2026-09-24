import { useState } from "react";
import ArrowIcon from "@/components/_shared/arrow-icon.component";

const subjects = [
  "Réservation",
  "Restaurant",
  "Traiteur",
  "Événement privé",
  "Événement professionnel",
  "Autre",
];

export default function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("L’envoi de messages n’est pas encore activé. Contactez-nous par téléphone ou par e-mail.");
  }

  return (
    <div className="contact-details-form">
      <p className="contact-form-eyebrow eyebrow">04 / NOUS ÉCRIRE</p>
      <form onSubmit={handleSubmit}>
        <div className="contact-form-field">
          <label htmlFor="contact-name">Nom et prénom <span>*</span></label>
          <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Votre nom" required />
        </div>
        <div className="contact-form-field">
          <label htmlFor="contact-email">Adresse e-mail <span>*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="votre@email.fr" required />
        </div>
        <div className="contact-form-field">
          <label htmlFor="contact-phone">Téléphone</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" />
        </div>
        <div className="contact-form-field">
          <label htmlFor="contact-subject">Sujet <span>*</span></label>
          <select id="contact-subject" name="subject" defaultValue="" required>
            <option value="" disabled>Votre demande</option>
            {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>
        <div className="contact-form-field contact-form-field--message">
          <label htmlFor="contact-message">Message <span>*</span></label>
          <textarea id="contact-message" name="message" rows="3" placeholder="Votre message…" required />
        </div>
        <button className="button button--rust contact-form-submit" type="submit">
          Envoyer ma demande <span><ArrowIcon direction="right" size={22} /></span>
        </button>
        <p className="contact-form-required"><span>*</span> Champs obligatoires</p>
        <p className="contact-form-status" aria-live="polite">{message}</p>
      </form>
    </div>
  );
}
