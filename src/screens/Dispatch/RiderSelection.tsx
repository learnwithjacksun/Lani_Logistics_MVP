import { Phone, Star, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { FormData, Rider } from "../../types/dispatch";
import { toast } from "react-hot-toast";

interface RiderSelectionProps {
  deliveryDetails: FormData;
  onRiderSelect: (rider: Rider) => void;
}

// Mock riders data - this would typically come from an API
const riders: Rider[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+2349063525949",
    rating: 4.8,
    distance: "2km away",
    eta: "10 mins",
    image: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    completedDeliveries: 128
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+2348123456790",
    rating: 4.9,
    distance: "3km away",
    eta: "15 mins",
    image: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    completedDeliveries: 256
  },
  {
    id: "3",
    name: "Mike Johnson",
    phone: "+2348123456791",
    rating: 4.7,
    distance: "1km away",
    eta: "5 mins",
    image: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
    completedDeliveries: 184
  }
];

const RiderSelection = ({ deliveryDetails, onRiderSelect }: RiderSelectionProps) => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const getWhatsAppLink = (phone: string, message: string) => {
    const formattedPhone = phone.replace(/\+/g, '').replace(/\s/g, '');
    const encodedMessage = encodeURIComponent(message);

    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Check if iOS
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        // iOS prefers whatsapp://
        return `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
      }
      // Android can use either, but intent:// is more reliable
      return `intent://send?phone=${formattedPhone}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    }

    // Desktop uses wa.me
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const handleRiderSelect = async (rider: Rider) => {
    setSelectedRider(rider);
    
    const message = `
🚚 New Delivery Request

📍 Pickup: ${deliveryDetails.pickupAddress}
⏰ Pickup Time: ${deliveryDetails.pickupTime === 'immediate' 
  ? 'Immediate Pickup'
  : `Scheduled for ${new Date(deliveryDetails.pickupDate).toLocaleString()}`
}
🎯 Delivery: ${deliveryDetails.deliveryAddress}
📦 Package: ${deliveryDetails.packageName} (${deliveryDetails.packageTexture})
💰 Amount: ₦${deliveryDetails.amount}

Additional Notes: ${deliveryDetails.notes || 'None'}
    `.trim();

    const whatsappUrl = getWhatsAppLink(rider.phone, message);
    
    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Could not open WhatsApp. Please try again.');
    }
    
    onRiderSelect(rider);
  };

  return (
    <DashboardLayout title="Select a Rider">
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-sub text-sm">Select a rider to handle your delivery</p>
        
        <div className="grid gap-4">
          {riders.map((rider) => (
            <button
              key={rider.id}
              onClick={() => handleRiderSelect(rider)}
              className={`w-full p-4 border rounded-xl flex items-center gap-4 transition-all ${
                selectedRider?.id === rider.id
                  ? "border-primary_1 bg-primary_1/5"
                  : "border-line hover:border-primary_1"
              }`}
            >
              {/* Rider Image */}
              <img 
                src={rider.image} 
                alt={rider.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              
              {/* Rider Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-main">{rider.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm">{rider.rating}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-4 text-sm text-sub">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{rider.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{rider.eta}</span>
                  </div>
                  <div className="text-primary_1">
                    {rider.completedDeliveries} deliveries
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="shrink-0">
                <div className="p-2 rounded-full bg-primary_1/10 text-primary_1">
                  <Phone size={20} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiderSelection; 