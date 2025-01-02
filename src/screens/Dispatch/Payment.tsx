// import { useState } from 'react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Package, MapPin, Clock, ArrowLeft, User } from "lucide-react";
import toast from "react-hot-toast";
import { useOrder } from "../../hooks";
import { DispatchForm } from "../../hooks/useDispatchForm";

interface PaymentProps {
  deliveryDetails: DispatchForm;
  onPaymentClose: () => void;
  selectedCity: string;
}

const Payment = ({
  deliveryDetails,
  onPaymentClose,
  selectedCity,
}: PaymentProps) => {
  const { createDispatchOrder, isLoading } = useOrder();

  const handlePayment = async () => {
    toast.promise(createDispatchOrder(deliveryDetails, selectedCity), {
      loading: "Creating order...",
      success: "Order created successfully",
      error: (error) => error.message,
    });
  };

  return (
    <DashboardLayout title="Payment">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onPaymentClose}
          className="flex items-center gap-2 text-sub hover:text-main transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Edit Details</span>
        </button>

        {/* Order Summary */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-semibold text-main">Order Summary</h3>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Package size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Package</p>
                <p className="text-main font-medium">
                  {deliveryDetails.packageName}
                </p>
                <p className="text-xs text-sub mt-1">
                  Type: {deliveryDetails.packageTexture}
                </p>
                {deliveryDetails.notes && (
                  <p className="text-xs text-sub mt-1">
                    Notes: {deliveryDetails.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Locations</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-main">
                      From: {deliveryDetails.pickupAddress}
                    </p>
                    {deliveryDetails.pickupLandmark && (
                      <p className="text-xs text-sub">
                        Landmark: {deliveryDetails.pickupLandmark}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-main">
                      To: {deliveryDetails.deliveryAddress}
                    </p>
                    {deliveryDetails.deliveryLandmark && (
                      <p className="text-xs text-sub">
                        Landmark: {deliveryDetails.deliveryLandmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Receiver</p>
                <p className="text-main">{deliveryDetails.receiverName}</p>
                <p className="text-xs text-sub mt-1">
                  {deliveryDetails.receiverPhone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Pickup Time</p>
                <p className="text-main">
                  {deliveryDetails.pickupTime === "immediate"
                    ? "Immediate Pickup"
                    : deliveryDetails.pickupDate
                    ? new Date(deliveryDetails.pickupDate).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Delivery City</p>
                <p className="text-main">{deliveryDetails.deliveryCity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-main font-medium">Total Amount</span>
            <span className="text-xl font-semibold text-primary_1">
              ₦{deliveryDetails.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full btn btn-primary py-4 rounded-xl text-lg disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
