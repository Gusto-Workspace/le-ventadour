import { useRouter } from "next/router";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import BankHold from "@/components/reservations/bank-hold.component";

export default function ReservationBankHoldPage() {
  const router = useRouter();
  const reservationId = router.query.reservationId;
  return (
    <InteriorLayout title="Validation bancaire" description="Finaliser la validation sécurisée de votre réservation au Ventadour.">
      <section className="reservation-bank-page page-container" aria-labelledby="reservation-bank-title">
        <p className="eyebrow interior-eyebrow">RÉSERVATION</p>
        <h1 id="reservation-bank-title">Validation de<br /><em>votre carte.</em></h1>
        {reservationId ? <BankHold reservationId={String(reservationId)} /> : <p role="status">Chargement…</p>}
      </section>
    </InteriorLayout>
  );
}
