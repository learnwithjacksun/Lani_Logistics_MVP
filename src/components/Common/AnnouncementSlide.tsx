import {  MessageCircleWarning } from "lucide-react";
import "./AnnouncementSlide.css";

const AnnouncementSlide = () => {
  const text =
    "🚚 Lani's Promo: Uyo Same-day ₦1600, Scheduled ₦1500 | PH Delivery ₦2500 | Ends in 14 days! 🎉";

  return (
    <div className="bg-orange-500/10 overflow-hidden whitespace-nowrap w-full h-8 flex items-center gap-2">
      <div className="h-full min-w-9 z-10 flex items-center text-primary_1 justify-center border-r border-orange-500/20 backdrop-blur-md">
        <MessageCircleWarning size={20}  />
      </div>
      <div className="announcement-text">
        <p className="text-sm font-medium text-orange-500">{text}</p>
      </div>
    </div>
  );
};

export default AnnouncementSlide