import { useState } from "react";
import { askForLocationPermission } from "../utils/helpers";

const useMap = () => {
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

    const getLocation = async () => {
        const position = await askForLocationPermission();

        // @ts-expect-error position is not typed
        setLocation({ lat: position.coords.latitude || 0, lon: position.coords.longitude || 0 });
    }

  return {
    askForLocationPermission,
    getLocation,
    location
  }
}

export default useMap