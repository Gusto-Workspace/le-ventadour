import { useState } from "react";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { useRestaurant } from "@/contexts/restaurant.context";

const subjects = [
  "Réservation",
  "Restaurant",
  "Traiteur",
  "Événement privé",
  "Événement professionnel",
  "Autre",
];

export default function ContactForm() {
  const { restaurant, loading } = useRestaurant();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!restaurant?.email || isSubmitting) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          restaurantName: restaurant.name || "Le Ventadour",
          restaurantEmail: restaurant.email,
        }),
      });
      if (!response.ok) throw new Error("contact-form");
      form.reset();
      setIsSubmitted(true);
      setMessage("");
    } catch {
      setMessage("Votre message n’a pas pu être envoyé. Réessayez ou contactez-nous par téléphone.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) return <div className="contact-details-form contact-form-success" role="status">
    <p className="contact-form-eyebrow eyebrow">04 / NOUS ÉCRIRE</p>
    <h3>Message envoyé.</h3>
    <p>Merci. Notre équipe vous répondra dès que possible.</p>
    <button type="button" className="reservation-back-link" onClick={() => setIsSubmitted(false)}>Nouveau message</button>
  </div>;

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
        <label className="contact-form-consent"><input name="consent" type="checkbox" required /><span>J’accepte que mes informations soient utilisées pour répondre à ma demande.</span></label>
        <button className="button button--rust contact-form-submit" type="submit" disabled={isSubmitting || loading || !restaurant?.email}>
          {isSubmitting ? "Envoi…" : "Envoyer ma demande"} <span><ArrowIcon direction="right" size={22} /></span>
        </button>
        <p className="contact-form-required"><span>*</span> Champs obligatoires</p>
        <p className="contact-form-status" aria-live="polite" role={message ? "alert" : "status"}>{message || (!loading && !restaurant?.email ? "L’envoi est momentanément indisponible. Contactez-nous par téléphone." : "")}</p>
      </form>
    </div>
  );
}
