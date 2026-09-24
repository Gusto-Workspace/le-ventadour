import Link from "next/link";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import EditorialPhoto from "@/components/_shared/interior/editorial-photo.component";
import QuoteForm from "@/components/traiteur/quote-form.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";
import { cateringServices, cocktailBites, weddingMoments, professionalEvents } from "@/_assets/data/editorial.data";

export default function TraiteurPage() {
  return (
    <InteriorLayout title="Traiteur" description="Le Ventadour côté Traiteur : cocktails, mariages et événements privés ou professionnels à Montauban.">
      <section className="inside-intro inside-intro--catering page-container" aria-labelledby="catering-page-title">
        <div className="inside-intro-copy">
          <p className="eyebrow interior-eyebrow">LE VENTADOUR CÔTÉ TRAITEUR</p>
          <h1 id="catering-page-title">L’art de recevoir,<br /><em>à votre manière.</em></h1>
          <span className="small-rule" />
          <p>Réceptions familiales, rendez-vous d’entreprise ou mariage&nbsp;: David Aranda imagine une prestation adaptée à votre événement, à vos envies et aux produits de saison.</p>
          <a className="button button--rust" href="#devis">Parlons de votre projet <span>→</span></a>
        </div>
        <div className="inside-intro-pair">
          <EditorialPhoto className="inside-intro-pair-main" src={homeAsset("traiteur-01")} alt="Bouchées préparées pour une réception" sizes="(max-width: 900px) 90vw, 42vw" />
          <EditorialPhoto className="inside-intro-pair-overlap" src={homeAsset("traiteur-02")} alt="Verrines pour une réception" sizes="(max-width: 900px) 55vw, 24vw" />
        </div>
      </section>

      <section className="catering-services page-container" aria-labelledby="services-title">
        <div className="catering-services-head"><p className="eyebrow interior-eyebrow">DES OCCASIONS, DES FORMULES</p><h2 id="services-title">Chaque événement<br /><em>a sa saveur.</em></h2></div>
        <div className="catering-services-list">
          {cateringServices.map((service) => <a className="catering-service" href={service.href} key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.detail}</p><i aria-hidden="true">↗</i></a>)}
        </div>
      </section>

      <section id="cocktail" className="cocktail-section" aria-labelledby="cocktail-title">
        <div className="cocktail-section-inner page-container">
          <div className="cocktail-section-copy"><p className="eyebrow interior-eyebrow">01 / COCKTAIL DÎNATOIRE</p><h2 id="cocktail-title">Le plaisir<br /><em>de partager.</em></h2><p>Pour un cocktail, un buffet dînatoire ou un apéritif prolongé, Le Ventadour compose des bouchées salées adaptées à votre réception. Quelques idées issues des propositions du Chef&nbsp;:</p><ul className="editorial-list">{cocktailBites.map((bite) => <li key={bite}>{bite}</li>)}</ul><p className="editorial-footnote">Suggestions indicatives, à ajuster selon la saison et votre projet.</p><a href="#devis" className="text-link">Imaginer mon cocktail</a></div>
          <EditorialPhoto className="cocktail-section-photo" src={homeAsset("traiteur-01")} alt="Cocktail dînatoire du Ventadour" sizes="(max-width: 900px) 90vw, 42vw" />
        </div>
      </section>

      <section id="mariage" className="wedding-section" aria-labelledby="wedding-title">
        <div className="wedding-section-inner page-container">
          <div className="wedding-section-heading"><p className="eyebrow eyebrow--light">02 / MARIAGE</p><h2 id="wedding-title">Votre histoire,<br /><em>notre savoir-faire.</em></h2><p>Le cocktail, les ateliers, le repas et le service se construisent avec vous. Le Ventadour adapte sa formule à votre lieu, au nombre de convives et au déroulement de la journée.</p><Link href="#devis" className="button button--white">Demander une proposition <span>↗</span></Link></div>
          <EditorialPhoto className="wedding-section-photo" label="Photo mariage" />
          <div className="wedding-moments">{weddingMoments.map((moment) => <div key={moment.number}><span>{moment.number}</span><h3>{moment.title}</h3><p>{moment.detail}</p></div>)}</div>
        </div>
      </section>

      <section id="professionnels" className="professionals-section page-container" aria-labelledby="professionals-title">
        <EditorialPhoto className="professionals-photo" label="Photo événement professionnel" />
        <div className="professionals-copy"><p className="eyebrow interior-eyebrow">03 / ENTREPRISES</p><h2 id="professionals-title">Des rencontres<br /><em>qui comptent.</em></h2><p>À domicile ou en entreprise, avec ou sans service, David Aranda étudie vos demandes en fonction de votre budget et de votre événement.</p><ul className="editorial-list">{professionalEvents.map((event) => <li key={event}>{event}</li>)}</ul><a href="#devis" className="text-link">Nous confier votre événement</a></div>
      </section>

      <section id="devis" className="quote-section" aria-labelledby="quote-title">
        <div className="quote-section-inner page-container"><div className="quote-section-intro"><p className="eyebrow interior-eyebrow">UN PROJET À PARTAGER</p><h2 id="quote-title">Parlons de<br /><em>votre réception.</em></h2><p>Indiquez-nous l’occasion, la date, le lieu et le nombre de convives si vous les connaissez. Nous pourrons imaginer ensemble une formule adaptée.</p></div><QuoteForm /></div>
      </section>
    </InteriorLayout>
  );
}
