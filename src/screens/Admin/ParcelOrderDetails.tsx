import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, Calendar, User, CreditCard } from 'lucide-react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useOrder } from "../../hooks";
import { Models } from 'appwrite';
import { storage, STORAGE } from '../../Backend/appwriteConfig';
import { OrderStatus } from '../../types/dispatch';

const ParcelOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { parcelOrders } = useOrder();
  const [order, setOrder] = useState<Models.Document | null>(null);

  useEffect(() => {
    if (!parcelOrders || !orderId) return;
    const foundOrder = parcelOrders.find(o => o.trackingId === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId, parcelOrders]);

  const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
    'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    'in-transit': { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    'delivered': { bg: 'bg-green-500/10', text: 'text-green-500' },
    'cancelled': { bg: 'bg-red-500/10', text: 'text-red-500' }
  };

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-main">Order not found</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-4 px-4 py-2 bg-primary_1 text-white rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img);
  };

  return (
    <DashboardLayout title="Order Details">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Status */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-main">Order Details</h1>
              <p className="text-sm text-sub">ID: {order.trackingId}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                statusColors[order.status as OrderStatus].bg} ${statusColors[order.status as OrderStatus].text
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.isPaid 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-start gap-3">
            <User size={18} className="text-primary_1 mt-1" />
            <div>
              <p className="text-sub text-sm">Customer</p>
              <p className="text-main font-medium">{order.senderName}</p>
              <p className="text-sm text-sub mt-1">{order.senderPhone}</p>
            </div>
          </div>
        </div>

        {/* Package Details with Image */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-main">Package Details</h2>
          </div>
          <div className="p-4">
            {order.packageImage ? (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-background_2">
                <img 
                  src={imgUrl(order.packageImage)} 
                  alt={order.packageName}
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
                <p className="text-main">{order.packageName}</p>
                <p className="text-xs text-sub mt-1">Type: {order.packageTexture}</p>
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
                <p className="text-main">{order.pickupAddress}</p>
                <p className="text-xs text-sub mt-1">Landmark: {order.pickupLandmark}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary_2 mt-1" />
              <div>
                <p className="text-sub text-sm">Delivery Location</p>
                <p className="text-main">{order.deliveryAddress}</p>
                <p className="text-xs text-sub mt-1">Landmark: {order.deliveryLandmark}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time and Payment */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Pickup Time</p>
                <p className="text-main">
                  {order.time === 'immediate' 
                    ? 'Immediate Pickup'
                    : new Date(order.scheduledDate).toLocaleString()
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Payment Details</p>
                <p className="text-main">₦{order.price.toLocaleString()}</p>
                <p className="text-xs text-sub mt-1">
                  Payment by: {order.paymentType === 'sender' ? 'Sender' : 'Receiver'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Created Date */}
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
    </DashboardLayout>
  );
};

export default ParcelOrderDetails; 