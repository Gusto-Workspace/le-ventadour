import Head from "next/head";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";

export default function ReservationFlowPage({ eyebrow, title, accent, description, children }) {
  return <InteriorLayout title={title} description={description || `${title} au Ventadour.`}>
    <Head><meta name="robots" content="noindex,nofollow" /></Head>
    <section className="reservation-bank-page reservation-service-page page-container" aria-labelledby="reservation-service-title">
      <p className="eyebrow interior-eyebrow">{eyebrow}</p>
      <h1 id="reservation-service-title">{title}<br /><em>{accent}</em></h1>
      <div className="reservation-service-body">{children}</div>
    </section>
  </InteriorLayout>;
}
