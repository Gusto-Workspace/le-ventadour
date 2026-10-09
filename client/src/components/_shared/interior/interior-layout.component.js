import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";
import SeoHead from "@/components/_shared/seo/seo-head.component";

export default function InteriorLayout({ title, description, noIndex = false, children }) {
  const { restaurant } = useRestaurant();
  const contact = getRestaurantContact(restaurant);
  return (
    <>
      <SeoHead title={`${title} — Le Ventadour, Montauban`} description={description} noIndex={noIndex} />
      <div className="interior-site">
        <NavComponent />
        <main>{children}</main>
        <FooterComponent contact={contact} />
      </div>
    </>
  );
}
