import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAuth, useOrder } from '../../hooks';
import { toast } from 'react-hot-toast';
import { databases, DB, USERS } from '../../Backend/appwriteConfig'; // Import Appwrite client
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Dashboard';

const MapScreen = () => {
  const { orders } = useOrder();
  const { user, userData } = useAuth();
  const [riderPosition, setRiderPosition] = useState<{ lat: number; lng: number } | null>({
    lat: userData?.riderLatitude || 0,
    lng: userData?.riderLongitude || 0
  });
  const [pickupPosition, setPickupPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryPosition, setDeliveryPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Assuming you have a way to get the current order
  const orderId = useParams().orderId;
  const currentOrder = orders.find(order => order.$id === orderId);



  useEffect(() => {
    if (currentOrder) {
      setPickupPosition({
        lat: parseFloat(currentOrder.pickupLatitude),
        lng: parseFloat(currentOrder.pickupLongitude),
      });
      setDeliveryPosition({
        lat: parseFloat(currentOrder.deliveryLatitude),
        lng: parseFloat(currentOrder.deliveryLongitude),
      });
    }
  }, [currentOrder]);

  const updateRiderLocation = useCallback(async (lat: number, lon: number) => {
    if(!user?.$id) return;
    try {
      await databases.updateDocument(DB, USERS, user?.$id, {
        riderLatitude: lat,
        riderLongitude: lon,
      });
    } catch (error) {
      console.error("Error updating rider location:", error);
    }
  }, [user?.$id]);

  useEffect(() => {
    const updateRiderPosition = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setRiderPosition({ lat: latitude, lng: longitude });

          await updateRiderLocation(latitude, longitude);
        });
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    const intervalId = setInterval(updateRiderPosition, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [updateRiderLocation]);

  if(!currentOrder) return <div>No order found</div>;


  

  return (
    <>
    <Header/>
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: "100vh", width: "100%" }}
        center={riderPosition || pickupPosition || deliveryPosition || { lat: 0, lng: 0 }}
        zoom={14}
      >
        {pickupPosition && (
          <Marker position={pickupPosition} label="Pickup" />
        )}
        {deliveryPosition && (
          <Marker position={deliveryPosition} label="Delivery" />
        )}
        {riderPosition && (
          <Marker position={riderPosition} label="Rider" icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for the rider
          }} />
        )}
      </GoogleMap>
    </LoadScript>
    </>
  );
};

export default MapScreen; 