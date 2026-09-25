import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RestaurantContext = createContext(null);

function getRestaurantConfig() {
  return {
    apiUrl: String(process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, ""),
    restaurantId: String(process.env.NEXT_PUBLIC_RESTAURANT_ID || "").trim(),
  };
}

export function RestaurantProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const config = useMemo(getRestaurantConfig, []);

  const loadRestaurant = useCallback(async () => {
    setLoading(true);
    setError(false);
    if (!config.apiUrl || !config.restaurantId) {
      setRestaurant(null);
      setError(true);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${config.apiUrl}/restaurants/${config.restaurantId}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.restaurant) throw new Error("restaurant_unavailable");
      setRestaurant(payload.restaurant);
    } catch (requestError) {
      console.error("Restaurant data could not be loaded.", requestError);
      setRestaurant(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => { loadRestaurant(); }, [loadRestaurant]);

  const value = useMemo(() => ({
    restaurant,
    loading,
    error,
    reload: loadRestaurant,
    apiUrl: config.apiUrl,
  }), [restaurant, loading, error, loadRestaurant, config.apiUrl]);

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
}

export function useRestaurant() {
  return useContext(RestaurantContext) || {
    restaurant: null,
    loading: true,
    error: false,
    reload: () => {},
    apiUrl: "",
  };
}
