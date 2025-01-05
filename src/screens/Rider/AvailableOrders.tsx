import {
  ChevronDown,
  CircleCheckBig,
  CircleEllipsis,
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
import { useAuth } from "../../hooks";

const statusColors: Record<'unpaid' | 'paid', { bg: string; text: string }> = {
  'unpaid': { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  'paid': { bg: 'bg-green-500/10', text: 'text-green-500' }
};

const AvailableOrders = () => {
  const { allOrders, acceptOrder, isLoading, orders } = useOrder();
  const { userData } = useAuth();

  // Check active orders count
  const activeOrdersCount = orders.filter(
    order => order.status === "in-transit"
  ).length;

  const canAcceptOrders = activeOrdersCount < 2;

  // Add warning message at the top if rider has max orders
  const renderWarningBanner = () => {
    if (!canAcceptOrders) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <p className="text-red-500 text-sm">
            You have reached the maximum limit of 2 active orders. 
            Please complete your current deliveries before accepting new orders.
          </p>
        </div>
      );
    }
    return null;
  };

  const handleAcceptOrder = (orderId: string) => {
    toast.promise(acceptOrder(orderId), {
      loading: "Accepting order...",
      success: "Order accepted successfully",
      error: (error: Error) => error.message,
    });
  };

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img);
  };
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});

  const handleDetailsToggle = (orderId: string) => {
    setOpenDetails(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const noOrdersMessage = () => {
    if (!userData?.location) {
      return "Please set your location to see available orders";
    }
    return `No orders available in ${userData.location} at the moment`;
  };

  return (
    <DashboardLayout title="Available Orders">
      <div className="max-w-3xl mx-auto space-y-6">
        {renderWarningBanner()}
        
        {/* Header Stats */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Package size={18} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-medium text-main">New Orders</h3>
              <p className="text-sm text-sub">
                {allOrders.length} orders available in {userData?.location || 'your area'}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {allOrders.length === 0 ? (
            <div className="text-center py-12 text-sub">
              {noOrdersMessage()}
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
                      {order.paymentType === 'receiver' && (
                        <span className="ml-2 text-sm text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                          Collect on Delivery
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <button 
                      className="btn text-main" 
                      onClick={() => handleDetailsToggle(order.$id)}
                    >
                      <span>Details</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-primary_1 duration-200 ${
                          openDetails[order.$id] ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {openDetails[order.$id] && (
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
                    
                    {/* payment status */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-2 rounded-full text-sm w-full flex items-center gap-2 ${
                        statusColors[order.isPaid ? 'paid' : 'unpaid'].bg} ${
                        statusColors[order.isPaid ? 'paid' : 'unpaid'].text
                      }`}>
                        {order.isPaid ? (
                          <CircleCheckBig size={18} className="text-primary_2" />
                        ) : (
                          <CircleEllipsis size={18} className="text-primary_1" />
                        )}
                        {order.isPaid ? 'Payment Completed' : 'Pay on Delivery'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order?.$id)}
                      className="w-full btn btn-primary py-3 rounded-xl"
                      disabled={isLoading || !canAcceptOrders}
                    >
                      {!canAcceptOrders 
                        ? "Complete current orders first" 
                        : "Accept Order"}
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
