import ReservationFlowPage from "@/components/reservations/reservation-flow-page.component";
import ResumeBankHold from "@/components/reservations/resume-bank-hold.component";

export default function ReservationResumePage({ reservationId }) {
  return <ReservationFlowPage eyebrow="RÉSERVATION" title="Reprendre votre" accent="validation."><ResumeBankHold reservationId={reservationId} /></ReservationFlowPage>;
}

export async function getServerSideProps(context) {
  return { props: { reservationId: String(context.params?.reservationId || "") } };
}
