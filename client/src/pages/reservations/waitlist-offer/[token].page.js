import ReservationFlowPage from "@/components/reservations/reservation-flow-page.component";
import WaitlistOffer from "@/components/reservations/waitlist-offer.component";

export default function WaitlistOfferPage({ token }) {
  return <ReservationFlowPage eyebrow="LISTE D’ATTENTE" title="Une table vient" accent="de se libérer."><WaitlistOffer token={token} /></ReservationFlowPage>;
}

export async function getServerSideProps(context) {
  return { props: { token: String(context.params?.token || "") } };
}
