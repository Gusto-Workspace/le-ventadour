import Link from "next/link";
import BrandComponent from "@/components/_shared/brand/brand.component";
import { getOpeningHoursGroups, normalizeSocialHref } from "@/_assets/utils/restaurant-data.utils";

export default function FooterComponent({ contact }) {
  const telephone = contact.phone.replace(/[^+\d]/g, "");
  const hours = getOpeningHoursGroups(contact.openingHours || []);
  const instagram = normalizeSocialHref(contact.socialMedia?.instagram);
  const facebook = normalizeSocialHref(contact.socialMedia?.facebook);
  const addressLines = [contact.address.line1, [contact.address.zipCode, contact.address.city].filter(Boolean).join(" ")].filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="footer-main page-container">
        <BrandComponent footer />
        <div className="footer-contact">
          {(addressLines.length || hours.length) && <div className="footer-address">
            {addressLines.length ? <p>{addressLines.map((line) => <span key={line}>{line}<br /></span>)}</p> : null}
            {hours.length ? <p>{hours.map((item) => <span key={item.label}>{item.label}<br />{item.value}<br /></span>)}</p> : null}
          </div>}
          {contact.phone && <a href={`tel:${telephone}`}>{contact.phone}</a>}
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          <div className="footer-social">
            {instagram && <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.7" cy="6.5" r="1.1" fill="currentColor" /></svg>
            </a>}
            {facebook && <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 21v-8.1h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5H17V3.4c-.7-.1-1.6-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6v1.9H7v3.2h2.9V21h3.7Z" /></svg>
            </a>}
          </div>
        </div>
      </div>
      <div className="footer-bottom page-container">
        <span>© {new Date().getFullYear()} Le Ventadour – Tous droits réservés.</span>
        <span>Une cuisine, des rencontres, un territoire.</span>
        <nav className="footer-legal-links" aria-label="Informations légales">
          <Link href="/legales">Mentions légales</Link>
          <Link href="/policy">Politique de confidentialité</Link>
          <a href="https://gusto-manager.com" target="_blank" rel="noreferrer">Propulsé par Gusto-Manager</a>
        </nav>
      </div>
    </footer>
  );
}
