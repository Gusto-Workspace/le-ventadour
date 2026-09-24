import Image from "next/image";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import ReservationFlow from "@/components/reservations/reservation-flow.component";

export default function ReservationsPage() {
  return (
    <InteriorLayout title="Réserver" description="Réserver une table pour le déjeuner au Ventadour, restaurant à Montauban.">
      <section className="reservation-hero" aria-labelledby="booking-title">
        <div className="reservation-hero-image" aria-hidden="true">
          <Image src="/img/reservations/bg-hero-resa.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="reservation-hero-copy page-container">
          <p className="eyebrow hero-eyebrow">RÉSERVER UNE TABLE</p>
          <h1 id="booking-title">On se retrouve<br /><em>à table ?</em></h1>
          <span className="small-rule" />
          <p>Pour le déjeuner, l’équipe du Ventadour vous accueille du lundi au vendredi, de 12h à 14h. Contactez-nous pour connaître les disponibilités et recevoir une confirmation.</p>
          <a className="button button--rust" href="#reservation">Choisir une date <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <ReservationFlow />
    </InteriorLayout>
  );
}
