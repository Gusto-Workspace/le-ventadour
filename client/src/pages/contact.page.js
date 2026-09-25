import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import EditorialPhoto from "@/components/_shared/interior/editorial-photo.component";
import ContactForm from "@/components/contact/contact-form.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";
import { useRestaurant } from "@/contexts/restaurant.context";
import { getOpeningHoursGroups } from "@/_assets/utils/restaurant-data.utils";

export default function ContactPage() {
  const { restaurant } = useRestaurant();
  const contact = getRestaurantContact(restaurant);
  const telephone = contact.phone.replace(/[^+\d]/g, "");
  const openingHours = getOpeningHoursGroups(contact.openingHours);
  const contactDescription = `Contacter Le Ventadour et David Aranda${contact.addressText ? ` au ${contact.addressText}` : " à Montauban"}.`;
  return (
    <InteriorLayout title="Contact" description={contactDescription}>
      <section className="inside-intro inside-intro--contact page-container" aria-labelledby="contact-page-title">
        <div className="inside-intro-copy"><p className="eyebrow interior-eyebrow">NOUS TROUVER</p><h1 id="contact-page-title">Une adresse,<br /><em>des rencontres.</em></h1><span className="small-rule" /><p>Au bord du Tarn, Le Ventadour vous accueille dans ses voûtes de briques. Une question, une table à réserver, une réception à organiser ? Parlons-en.</p></div>
        <EditorialPhoto className="inside-intro-photo contact-intro-photo" src={homeAsset("enseigne")} alt="L’enseigne du Ventadour sur le mur de briques" sizes="(max-width: 900px) 90vw, 42vw" />
      </section>

      <section className="contact-details" aria-labelledby="contact-details-title">
        <div className="contact-details-inner page-container">
          <div className="contact-details-intro">
            <p className="eyebrow interior-eyebrow">CONTACT</p>
            <h2 id="contact-details-title">Parlons-<em>en.</em></h2>
            <span className="small-rule" />
            <p>Une question, une réservation, un événement à imaginer ? Notre équipe est à votre écoute et se fera un plaisir de vous répondre.</p>
            <EditorialPhoto className="contact-details-photo" src="/img/contact/contact-photo.png" alt="Une table dressée dans la salle du Ventadour" sizes="(max-width: 900px) 90vw, 32vw" />
          </div>

          <div className="contact-detail-list" aria-label="Coordonnées du Ventadour">
            {contact.addressText && <div className="contact-detail">
              <span>01 / ADRESSE</span>
              <p>{contact.address.line1}<br />{[contact.address.zipCode, contact.address.city].filter(Boolean).join(" ")}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.addressText)}`} target="_blank" rel="noreferrer">Voir l’itinéraire <ArrowIcon size={18} /></a>
            </div>}
            {contact.phone && <div className="contact-detail">
              <span>02 / TÉLÉPHONE</span>
              <a className="contact-detail-main" href={`tel:${telephone}`}>{contact.phone}</a>
              <p>Pour votre déjeuner ou votre événement.</p>
            </div>}
            {contact.email && <div className="contact-detail">
              <span>03 / E-MAIL</span>
              <a className="contact-detail-main" href={`mailto:${contact.email}`}>{contact.email}</a>
              <p>Nous répondrons à votre demande dès que possible.</p>
            </div>}
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="contact-visit page-container" aria-labelledby="visit-title"><EditorialPhoto className="contact-visit-photo" src={homeAsset("montauban-tarn")} alt="Le Tarn et le centre historique de Montauban" sizes="(max-width: 900px) 90vw, 55vw" /><div className="contact-visit-copy"><p className="eyebrow interior-eyebrow">CÔTÉ BISTROT</p><h2 id="visit-title">Le rendez-vous<br /><em>du déjeuner.</em></h2>{openingHours.length ? <><p>Les horaires du restaurant :</p><ul className="contact-opening-hours">{openingHours.map((day) => <li key={day.label}><span>{day.label}</span><span>{day.value}</span></li>)}</ul></> : null}<p>Pour une réservation, contactez l’équipe au minimum la veille. Elle vous confirmera sa disponibilité.</p><Link className="button button--dark" href="/reservations">Préparer ma visite <span><ArrowIcon size={22} /></span></Link></div></section>

      <section className="inside-outro" aria-labelledby="contact-outro-title"><div className="inside-outro-inner page-container"><div><p className="eyebrow eyebrow--light">CÔTÉ TRAITEUR</p><h2 id="contact-outro-title">Un événement<br /><em>en tête ?</em></h2></div><div><p>Cocktail, mariage ou réception professionnelle : racontez-nous votre projet et construisons ensemble une prestation qui vous ressemble.</p><Link href="/traiteur#devis" className="button button--white">Demander un devis <span><ArrowIcon size={22} /></span></Link></div></div></section>
    </InteriorLayout>
  );
}
