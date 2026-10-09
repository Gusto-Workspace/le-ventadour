import "@/styles/style.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { RestaurantProvider } from "@/contexts/restaurant.context";
import MotionController from "@/components/_shared/motion/motion-controller.component";

function TrackVisits() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  useEffect(() => {
    if (!router.isReady || !apiUrl || !restaurantId) return undefined;

    const sessionTimeout = 5 * 60 * 1000;
    const storageKey = `gusto:lastVisitSession:${restaurantId}`;
    const now = Date.now();
    let lastVisit = 0;

    try {
      lastVisit =
        Number.parseInt(window.localStorage.getItem(storageKey) || "0", 10) ||
        0;
    } catch {
      // Le suivi continue même si le navigateur bloque l'accès au stockage local.
    }

    if (lastVisit && now - lastVisit <= sessionTimeout) return undefined;

    const visitUrl = `${apiUrl.replace(/\/+$/, "")}/restaurants/${restaurantId}/visits`;
    const timeoutId = window.setTimeout(() => {
      const visitTimestamp = Date.now();

      try {
        const latestVisit =
          Number.parseInt(window.localStorage.getItem(storageKey) || "0", 10) ||
          0;
        if (latestVisit && visitTimestamp - latestVisit <= sessionTimeout)
          return;
        window.localStorage.setItem(storageKey, String(visitTimestamp));
      } catch {
        // La requête reste valide sans déduplication persistante.
      }

      fetch(visitUrl, { method: "POST", keepalive: true })
        .then((response) => {
          if (!response.ok)
            console.error("Impossible d'enregistrer la visite du site.");
        })
        .catch((error) =>
          console.error(
            "Erreur lors de l'enregistrement de la visite :",
            error,
          ),
        );
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [apiUrl, restaurantId, router.asPath, router.isReady]);

  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <RestaurantProvider>
      <TrackVisits />
      <MotionController />
      <Component {...pageProps} />
    </RestaurantProvider>
  );
}
