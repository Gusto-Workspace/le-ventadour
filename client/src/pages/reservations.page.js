import Image from "next/image";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import ReservationFlow from "@/components/reservations/reservation-flow.component";
import RendezvousHomeSection from "@/components/home/sections/rendezvous.home.section";

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
          <p>Pour un moment à partager ou une occasion particulière, choisissez la date et l’horaire qui vous conviennent.</p>
          <a className="button button--rust" href="#reservation">Choisir une date <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <ReservationFlow />
      <RendezvousHomeSection href="/contact" buttonText="Nous contacter" />
    </InteriorLayout>
  );
}
