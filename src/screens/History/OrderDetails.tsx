import {Package, MapPin, Clock, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { OrderStatus } from "../../types/dispatch";
import { Modal } from "../../components/Common";
import toast from "react-hot-toast";
import useOrder from "../../hooks/useOrder";
import { STORAGE } from "../../Backend/appwriteConfig";
import { storage } from "../../Backend/appwriteConfig";

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  'in-transit': { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  'delivered': { bg: 'bg-green-500/10', text: 'text-green-500' },
  'cancelled': { bg: 'bg-red-500/10', text: 'text-red-500' }
};

const OrderDetails = () => {
  const {orders} = useOrder()
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Find order by ID
  const order = orders.find(o => o.trackingId === orderId);

  const handleCancelOrder = () => {
    // In real app, this would be an API call
    toast.success('Order cancelled successfully');
    setShowCancelModal(false);
    navigate('/history');
  };

  if (!order) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-xl font-bold text-main mb-2">Order Not Found</h1>
          <p className="text-sub mb-6">The order you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/history')}
            className="btn btn-primary px-6 py-2 rounded-lg"
          >
            Back to History
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with Status */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-main">Order Details</h1>
              <p className="text-sm text-sub">ID: {order.trackingId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              statusColors[order.status as OrderStatus].bg} ${statusColors[order.status as OrderStatus].text
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Cancel Button for Pending Orders */}
          {order.status === 'pending' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full mt-4 p-3 border border-red-500 rounded-xl
                text-red-500 bg-red-500/10 hover:bg-red-500/20
                transition-colors text-sm font-medium"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Package Details with Image */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-main">Package Details</h2>
          </div>
          <div className="p-4">
            {order?.packageImage ? (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-background_2">
                <img 
                  src={imgUrl(order?.packageImage)} 
                  alt={order?.packageName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 mb-4 rounded-lg bg-background_2 flex items-center justify-center">
                <Package size={48} className="text-sub" />
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <Package size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Package Name</p>
                <p className="text-main">{order?.packageName}</p>
                <p className="text-xs text-sub mt-1">Type: {order?.packageTexture}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-main">Delivery Information</h2>
          </div>
          <div className="p-4 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Pickup Location</p>
                <p className="text-main">{order?.pickupAddress}</p>
                <p className="text-xs text-sub mt-1">Landmark: {order?.pickupLandmark}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary_2 mt-1" />
              <div>
                <p className="text-sub text-sm">Delivery Location</p>
                <p className="text-main">{order?.deliveryAddress}</p>
                <p className="text-xs text-sub mt-1">Landmark: {order?.deliveryLandmark}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time and Cost */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Pickup Time</p>
                <p className="text-main">
                  {order?.time === 'immediate' 
                    ? 'Immediate Pickup'
                    : new Date(order?.scheduledDate).toLocaleString()
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Order Date</p>
                <p className="text-main">
                  {new Date(order.$createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-main font-medium">Total Amount</span>
            <span className="text-xl font-semibold text-primary_1">
              ₦{order?.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Cancel Order Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Order"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-background_2 rounded-xl">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-main font-medium">Are you sure?</p>
                <p className="text-sm text-sub mt-1">
                  This action cannot be undone. The order will be cancelled immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-line rounded-lg
                  hover:bg-background_2 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-lg
                  hover:bg-red-600 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails; 