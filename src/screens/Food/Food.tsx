import { UtensilsCrossed } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";

const Food = () => {
  return (
    <DashboardLayout title="Food Ordering">
      <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-primary_2/10 mb-4">
          <UtensilsCrossed size={32} className="text-primary_2" />
        </div>
        <h2 className="text-2xl font-semibold text-main mb-2">Coming Soon!</h2>
        <p className="text-sub">
          We're cooking up something special. Our food delivery service will be available soon.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Food; 