import { useEffect } from "react";

const loadGoogleMapsScript = (apiKey: string) => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

const GoogleApiLoader = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      loadGoogleMapsScript(apiKey);
    } else {
      console.error("Google Maps API key is missing.");
    }
  }, []);

  return null
};

export default GoogleApiLoader;
