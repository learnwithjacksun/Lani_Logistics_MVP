import {
  ChevronDown,
  MapPin,
  Package,
  User,
  UserCheck,
} from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import toast from "react-hot-toast";
import useOrder from "../../hooks/useOrder";
import { STORAGE, storage } from "../../Backend/appwriteConfig";
import { useState } from "react";

const AvailableOrders = () => {
  const { allOrders, acceptOrder, isLoading } = useOrder();
  const handleAcceptOrder = (orderId: string) => {
    toast.promise(acceptOrder(orderId), {
      loading: "Accepting order...",
      success: "Order accepted successfully",
      error: (error: Error) => error.message,
    });
    // Handle order acceptance logic
  };

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img);
  };
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const handleDetailsOpen = () => {
    setIsDetailsOpen(prev => !prev);
  }
  return (
    <DashboardLayout title="Available Orders">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Package size={18} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-medium text-main">New Orders</h3>
              <p className="text-sm text-sub">
                {allOrders.length} orders available
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {allOrders.length === 0 ? (
            <div className="text-center py-12 text-sub">
              No orders available at the moment
            </div>
          ) : (
            allOrders.map((order) => (
              <div
                key={order?.$id}
                className="p-4 bg-background border border-line rounded-xl space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-main">
                      {order?.packageName}
                    </h3>
                    <p className="text-sm text-sub">ID: {order?.trackingId}</p>
                    <p className="font-medium text-main">
                      ₦{order?.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <button className="btn text-main" onClick={handleDetailsOpen}>
                      <span>Details</span>
                      <ChevronDown size={18} className={`text-primary_1 duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {isDetailsOpen && (
                  <>
                    {/* Package image */}
                    <div className="h-[200px] overflow-hidden">
                      <img
                        src={imgUrl(order?.packageImage)}
                        alt={order?.packageName}
                        className="w-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-primary_1 mt-1" />
                        <div>
                          <p className="text-sm text-sub">Pickup</p>
                          <p className="text-main">{order?.pickupAddress}</p>
                          {order?.pickupLandmark && (
                            <p className="text-xs text-sub mt-1">
                              Landmark: {order?.pickupLandmark}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-primary_2 mt-1" />
                        <div>
                          <p className="text-sm text-sub">Delivery</p>
                          <p className="text-main">{order?.deliveryAddress}</p>
                          {order?.deliveryLandmark && (
                            <p className="text-xs text-sub mt-1">
                              Landmark: {order?.deliveryLandmark}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User size={18} className="text-purple-500 mt-1" />
                        <div>
                          <p className="text-sm text-sub">Sender</p>
                          <p className="text-main text-sm">
                            {order?.senderName}
                          </p>
                          <p className="text-xs text-sub">
                            {order?.senderPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <UserCheck size={18} className="text-blue-500 mt-1" />
                        <div>
                          <p className="text-sm text-sub">Receiver</p>
                          <p className="text-main text-sm">
                            {order?.receiverName}
                          </p>
                          <p className="text-xs text-sub">
                            {order?.receiverPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order?.$id)}
                      className="w-full btn btn-primary py-3 rounded-xl"
                      disabled={isLoading}
                    >
                      Accept Order
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AvailableOrders;
