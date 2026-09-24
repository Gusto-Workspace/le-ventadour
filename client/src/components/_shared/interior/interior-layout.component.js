import Head from "next/head";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";

export default function InteriorLayout({ title, description, children }) {
  const contact = getRestaurantContact();
  return (
    <>
      <Head>
        <title>{`${title} — Le Ventadour, Montauban`}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="interior-site">
        <NavComponent />
        <main>{children}</main>
        <FooterComponent contact={contact} />
      </div>
    </>
  );
}
