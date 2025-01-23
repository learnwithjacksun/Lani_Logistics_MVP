import { useState } from 'react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Package, MapPin, Clock, ArrowLeft, User, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth, useOrder } from "../../hooks";
import { DispatchForm } from "../../hooks/useDispatchForm";
import { PaystackButton } from "react-paystack";

interface PaymentProps {
  deliveryDetails: DispatchForm;
  onPaymentClose: () => void;
  selectedCity: string;
  totalAmount: string;
}

const publicKey = "pk_test_36a25be00a369ea7d01b5354a5d83e3c003c2cde";

const Payment: React.FC<PaymentProps> = ({
  deliveryDetails,
  onPaymentClose,
  selectedCity,
  totalAmount,

}) => {
  const [paymentType, setPaymentType] = useState<'sender' | 'receiver'>('sender');
  const { userData } = useAuth();
  const { createDispatchOrder } = useOrder();

  const componentProps = {
    email: userData?.email,
    amount: Number(totalAmount) * 100,
    metadata: {
      name: userData?.name,
      phone: userData?.phone,
      custom_fields: []
    },
    publicKey,
    text: "Pay Now",
    onSuccess: () => handlePayment(paymentType),
    onClose: () => toast.error("Payment cancelled"),
  };

  const handlePayment = async (type: 'sender' | 'receiver') => {
    toast.promise(
      createDispatchOrder({
        ...deliveryDetails,
        paymentType: type,
        amount: Number(totalAmount),
      }, selectedCity),
      {
        loading: "Creating order...",
        success: "Order created successfully",
        error: (error) => error.message,
      }
    );
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
              ₦{totalAmount}
            </span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-semibold text-main">Payment Options</h3>
          </div>
          <div className="p-4 space-y-4">
            <label 
              className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer
                ${paymentType === 'sender' ? 'border-primary_1 bg-primary_1/5' : 'border-line'}`}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === 'sender'}
                onChange={() => setPaymentType('sender')}
                className="hidden"
              />
              <div className={`p-2 rounded-lg ${paymentType === 'sender' ? 'bg-primary_1/10' : 'bg-background_2'}`}>
                <Wallet size={20} className={paymentType === 'sender' ? 'text-primary_1' : 'text-sub'} />
              </div>
              <div>
                <h4 className="font-medium text-main">Pay Now</h4>
                <p className="text-sm text-sub">Sender makes payment immediately</p>
              </div>
            </label>

            <label 
              className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer
                ${paymentType === 'receiver' ? 'border-primary_1 bg-primary_1/5' : 'border-line'}`}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === 'receiver'}
                onChange={() => setPaymentType('receiver')}
                className="hidden"
              />
              <div className={`p-2 rounded-lg ${paymentType === 'receiver' ? 'bg-primary_1/10' : 'bg-background_2'}`}>
                <User size={20} className={paymentType === 'receiver' ? 'text-primary_1' : 'text-sub'} />
              </div>
              <div>
                <h4 className="font-medium text-main">Pay on Delivery</h4>
                <p className="text-sm text-sub">Receiver pays when package arrives</p>
              </div>
            </label>
          </div>
        </div>

        {/* Conditional Button Rendering */}
        {paymentType === 'sender' ? (
          <PaystackButton
            className="w-full btn btn-primary py-4 rounded-xl text-lg disabled:opacity-50"
            {...componentProps}
          />
        ) : (
          <button
            onClick={() => handlePayment('receiver')}
            className="w-full btn btn-primary py-4 rounded-xl text-lg"
          >
            Create Order
          </button>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payment;
