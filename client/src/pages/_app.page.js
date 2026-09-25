import "@/styles/style.scss";
import { RestaurantProvider } from "@/contexts/restaurant.context";
import MotionController from "@/components/_shared/motion/motion-controller.component";

export default function App({ Component, pageProps }) {
  return (
    <RestaurantProvider>
      <MotionController />
      <Component {...pageProps} />
    </RestaurantProvider>
  );
}
