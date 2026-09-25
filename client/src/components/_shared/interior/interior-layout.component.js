import Head from "next/head";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";

export default function InteriorLayout({ title, description, children }) {
  const { restaurant, error: restaurantError, reload } = useRestaurant();
  const contact = getRestaurantContact(restaurant);
  return (
    <>
      <Head>
        <title>{`${title} — Le Ventadour, Montauban`}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="interior-site">
        <NavComponent />
        {restaurantError && <p className="api-data-message" role="alert">Les informations du restaurant ne sont pas disponibles. <button type="button" onClick={reload}>Réessayer</button></p>}
        <main>{children}</main>
        <FooterComponent contact={contact} />
      </div>
    </>
  );
}
