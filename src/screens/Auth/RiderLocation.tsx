import { useState } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../Layouts/AuthLayout";
import { useAuth } from "../../hooks";

const locations = [
  {
    city: "Uyo",
    state: "Akwa Ibom",
  },
  {
    city: "Port Harcourt",
    state: "Rivers",
  },
  {
    city: "Abeokuta",
    state: "Ogun",
  },
];

const RiderLocation = () => {
  const { updateUserLocation,  } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof locations)[0] | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      toast.error("Please select your location");
      return;
    }
    if(!updateUserLocation) {
      toast.error("Failed to update location");
      return;
    }
      toast.promise(updateUserLocation(selectedLocation.city), {
        loading: "Updating location...",
        success: "Location updated successfully",
        error: (error) => {
          console.error("Update location error:", error);
          return "Failed to update location";
        },
      });
   

   
  };

  return (
    <AuthLayout
      title="Select Your Location 📍"
      subtitle="Choose the city where you'll be making deliveries"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          {locations.map((location) => (
            <button
              key={location.city}
              type="button"
              onClick={() => setSelectedLocation(location)}
              className={`p-2 pr-4 border rounded-xl flex items-center gap-4 transition-all ${
                selectedLocation?.city === location.city
                  ? "border-primary_1 bg-primary_1/5"
                  : "border-line hover:border-primary_1"
              }`}
            >
              <div
                className={`p-3 rounded-md ${
                  selectedLocation?.city === location.city
                    ? "bg-orange-500/10 text-primary_1"
                    : "bg-background_2 text-sub"
                }`}
              >
                <Building2 size={24} />
              </div>

              <div className="flex-1 text-left">
                <h3 className="font-medium text-main">{location.city}</h3>
                <p className="text-sm text-sub">{location.state} State</p>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedLocation?.city === location.city
                    ? "border-primary_1"
                    : "border-line"
                }`}
              >
                {selectedLocation?.city === location.city && (
                  <div className="w-3 h-3 rounded-full bg-primary_1" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </form>
    </AuthLayout>
  );
};

export default RiderLocation;
