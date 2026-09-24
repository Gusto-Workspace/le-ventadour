import { getRestaurantContact } from "@/_assets/utils/restaurant-contact.utils";
import HeroHomeSection from "./sections/hero.home.section";
import CuisineHomeSection from "./sections/cuisine.home.section";
import StoryHomeSection from "./sections/story.home.section";
import CateringHomeSection from "./sections/catering.home.section";
import LocationHomeSection from "./sections/location.home.section";
import RendezvousHomeSection from "./sections/rendezvous.home.section";
import FooterComponent from "@/components/_shared/footer/footer.component";

export default function HomePageComponent() {
  const contact = getRestaurantContact();

  return (
    <>
      <main>
        <HeroHomeSection />
        <CuisineHomeSection />
        <StoryHomeSection />
        <CateringHomeSection />
        <LocationHomeSection contact={contact} />
        <RendezvousHomeSection />
      </main>
      <FooterComponent contact={contact} />
    </>
  );
}
