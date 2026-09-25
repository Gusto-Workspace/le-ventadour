import ReservationFlowPage from "@/components/reservations/reservation-flow-page.component";
import ManageReservation from "@/components/reservations/manage-reservation.component";

export default function ReservationManagePage({ reservationId, manageToken }) {
  return <ReservationFlowPage eyebrow="GESTION EN LIGNE" title="Votre" accent="réservation." description="Consultez et gérez votre réservation au Ventadour.">
    <ManageReservation reservationId={reservationId} manageToken={manageToken} />
  </ReservationFlowPage>;
}

export async function getServerSideProps(context) {
  return { props: { reservationId: String(context.params?.reservationId || ""), manageToken: String(context.query?.token || "").trim() } };
}
