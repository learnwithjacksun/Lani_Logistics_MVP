import { useState } from "react";
import { askForLocationPermission } from "../utils/helpers";

const useMap = () => {
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

    const getLocation = async () => {
        try {
            const position = await askForLocationPermission();
            setLocation({ lat: position.coords.latitude || 0, lon: position.coords.longitude || 0 });
        } catch (error) {
            console.error("Error getting location:", error);
        }
    }

  return {
    getLocation,
    location
  }
}

export default useMap