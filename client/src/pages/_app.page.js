import "@/styles/style.scss";
import { RestaurantProvider } from "@/contexts/restaurant.context";

export default function App({ Component, pageProps }) {
  return (
    <RestaurantProvider>
      <Component {...pageProps} />
    </RestaurantProvider>
  );
}
