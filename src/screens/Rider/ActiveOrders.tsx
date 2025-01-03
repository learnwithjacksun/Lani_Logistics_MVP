import { Package } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useOrder } from "../../hooks";
import { storage, STORAGE } from "../../Backend/appwriteConfig";
import { useNavigate } from "react-router-dom";

const ActiveOrders = () => {
  const { orders } = useOrder();
  const navigate = useNavigate();

  const activeOrders = orders.filter(order => order.status === "in-transit");

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img);
  };

  return (
    <DashboardLayout title="Active Orders">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Orders List */}
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-8 text-sub">
              No active orders
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.$id}
                onClick={() => navigate(`/history/${order.$id}`)}
                className="bg-background border border-line rounded-xl p-4 space-y-4 cursor-pointer hover:border-primary_1 transition-all"
              >
                <div className="flex gap-4">
                  {/* Package Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-background_2 shrink-0">
                    {order?.packageImage ? (
                      <img 
                        src={imgUrl(order?.packageImage)} 
                        alt={order.packageName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-sub" />
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-main truncate">{order?.packageName}</h3>
                        <p className="text-xs text-sub">ID: {order?.trackingId}</p>
                      </div>
                      <span className="shrink-0 px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-500">
                        In Transit
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-sub truncate">
                      {order?.pickupAddress} → {order?.deliveryAddress}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActiveOrders; 