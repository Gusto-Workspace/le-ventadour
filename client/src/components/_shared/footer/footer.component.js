import BrandComponent from "@/components/_shared/brand/brand.component";

export default function FooterComponent({ contact }) {
  const telephone = contact.phone.replace(/[^+\d]/g, "");
  return <footer className="site-footer"><div className="footer-main page-container"><BrandComponent footer /><div className="footer-address"><p>{contact.address.line1}<br />{contact.address.zipCode} {contact.address.city}</p><p>{contact.openingHoursText[0]}<br />{contact.openingHoursText[1]}</p></div><div className="footer-contact"><a href={`tel:${telephone}`}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><div className="footer-social"><a href="https://www.instagram.com/restaurant_le_ventadour/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/Restaurant-le-Ventadour-375359622594477/" target="_blank" rel="noreferrer">Facebook ↗</a></div></div></div><div className="footer-bottom page-container"><span>© {new Date().getFullYear()} Le Ventadour – Tous droits réservés.</span><span>Une cuisine, des rencontres, un territoire.</span><a href="https://le-ventadour.com/" target="_blank" rel="noreferrer">Site officiel ↗</a></div></footer>;
}
