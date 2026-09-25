import Link from "next/link";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";

export default function PolicyPage() {
  const { restaurant } = useRestaurant();
  const contact = getRestaurantContact(restaurant);

  return <InteriorLayout title="Politique de confidentialité" description="Politique de confidentialité du site Le Ventadour à Montauban.">
    <section className="legal-page page-container" aria-labelledby="policy-page-title">
      <p className="eyebrow interior-eyebrow">INFORMATIONS</p>
      <h1 id="policy-page-title">Politique de<br /><em>confidentialité.</em></h1>
      <p className="legal-page-intro">Cette page décrit les données utilisées par les formulaires et services proposés sur le site du Ventadour.</p>
      <article><h2>Responsable du traitement</h2><p>Le responsable du traitement est l’exploitant du restaurant Le Ventadour. Vous pouvez exercer vos droits en passant par la <Link href="/contact">page contact</Link>{contact.email ? <> ou en écrivant à <a href={`mailto:${contact.email}`}>{contact.email}</a></> : null}.</p></article>
      <article><h2>Données collectées</h2><p>Le formulaire de contact peut recueillir votre nom, adresse e-mail, téléphone, sujet et message. Le formulaire de réservation recueille les informations nécessaires à la gestion de votre demande, telles que votre identité, vos coordonnées, la date, l’horaire, le nombre de convives et un commentaire éventuel.</p></article>
      <article><h2>Finalités et base juridique</h2><p>Ces données servent à répondre à vos demandes, gérer les réservations et assurer le fonctionnement technique des services sollicités. Selon le cas, le traitement repose sur votre demande, l’exécution du service ou les obligations légales applicables.</p></article>
      <article><h2>Destinataires et conservation</h2><p>Les données sont accessibles aux personnes habilitées du restaurant et aux prestataires techniques nécessaires au fonctionnement du site. Elles sont conservées pendant une durée proportionnée à leur finalité et aux obligations légales.</p></article>
      <article><h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification, l’effacement ou la limitation du traitement de vos données, vous y opposer lorsque le droit le prévoit, demander leur portabilité lorsqu’elle s’applique, et introduire une réclamation auprès de la CNIL. Pour exercer vos droits, utilisez la <Link href="/contact">page contact</Link>.</p></article>
      <article><h2>Cookies et stockage local</h2><p>Le site n’utilise pas de cookies publicitaires. Certaines informations techniques liées à une réservation peuvent être conservées temporairement dans le stockage local de votre navigateur afin de permettre la reprise du parcours.</p></article>
    </section>
  </InteriorLayout>;
}
