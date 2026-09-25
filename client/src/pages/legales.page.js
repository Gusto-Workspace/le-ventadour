import Link from "next/link";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";

export default function LegalesPage() {
  const { restaurant } = useRestaurant();
  const contact = getRestaurantContact(restaurant);
  const address = contact.addressText || "23 quai Villebourbon, 82000 Montauban";

  return <InteriorLayout title="Mentions légales" description="Mentions légales du site Le Ventadour à Montauban.">
    <section className="legal-page page-container" aria-labelledby="legal-page-title">
      <p className="eyebrow interior-eyebrow">INFORMATIONS</p>
      <h1 id="legal-page-title">Mentions <em>légales.</em></h1>
      <p className="legal-page-intro">Les informations administratives, techniques et juridiques liées au site du Ventadour.</p>
      <article><h2>Éditeur du site</h2><p>Le présent site est édité pour le restaurant <strong>Le Ventadour</strong>, situé {address}. Les informations administratives définitives concernant l’exploitant du restaurant sont à compléter par celui-ci.</p></article>
      <article><h2>Direction de la publication</h2><p>La direction de la publication est assurée par l’exploitant du restaurant Le Ventadour.</p></article>
      <article><h2>Hébergement et services techniques</h2><p>Les services techniques du site sont fournis dans le cadre de la plateforme Gusto Manager.</p></article>
      <article><h2>Objet du site</h2><p>Le site présente le restaurant, sa carte, ses actualités, ses informations pratiques et ses services de contact, de réservation et de traiteur.</p></article>
      <article><h2>Propriété intellectuelle</h2><p>Les textes, photographies, logos, éléments graphiques et développements présents sur ce site sont protégés. Toute reproduction ou exploitation sans autorisation préalable est interdite.</p></article>
      <article><h2>Responsabilité</h2><p>Les informations du site peuvent évoluer. Le Ventadour s’efforce d’en assurer l’exactitude, sans garantir l’absence d’erreur ni l’accès permanent au service.</p></article>
      <article><h2>Données personnelles</h2><p>Les traitements liés aux formulaires de contact et de réservation sont détaillés dans la <Link href="/policy">politique de confidentialité</Link>.</p></article>
    </section>
  </InteriorLayout>;
}
