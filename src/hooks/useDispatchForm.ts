import { useState } from "react";
import toast from "react-hot-toast";


export interface DispatchForm {
  packageName: string;
  packageTexture: "breakable" | "non-breakable";
  packageImage?: File;
  pickupAddress: string;
  pickupLandmark?: string;
  deliveryAddress: string;
  deliveryLandmark?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  notes?: string;
  pickupTime: "immediate" | "scheduled";
  pickupDate?: string;
  receiverName: string;
  receiverPhone: string;
  amount: number;
  deliveryCity: string;
  paymentType?: 'sender' | 'receiver';
  isPaid?: boolean;
}

const useDispatchForm = () => {
  const [showPayment, setShowPayment] = useState(false);

  const getInitialDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState<DispatchForm>({
    packageName: "",
    packageTexture: "non-breakable",
    pickupAddress: "",
    pickupLandmark: "",
    deliveryAddress: "",
    deliveryLandmark: "",
    pickupLatitude: 0,
    pickupLongitude: 0,
    deliveryLatitude: 0,
    deliveryLongitude: 0,
    notes: "",
    pickupTime: "immediate",
    pickupDate: getInitialDateTime(),
    receiverName: "",
    receiverPhone: "",
    amount: 0,
    deliveryCity: "Uyo",
    paymentType: "sender",
    isPaid: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'pickupTime') {
      setFormData(prev => ({
        ...prev,
        [name]: value as "immediate" | "scheduled",
        amount: value === 'scheduled' ? prev.amount - 100 : prev.amount + 100
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        packageImage: file,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.pickupAddress) {
      toast.error("Please enter a pickup address");
      return;
    }
    if (!formData.deliveryAddress) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (!formData.packageName) {
      toast.error("Please enter a package name");
      return;
    }
    if (!formData.packageImage) {
      toast.error("Please upload a package image");
      return;
    }

    if (!formData.receiverName) {
      toast.error("Please enter a receiver name");
      return;
    }

    if (!formData.receiverPhone) {
      toast.error("Please enter a receiver phone number");
      return;
    }

    if (formData.pickupTime === "scheduled" && !formData.pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }

    setShowPayment(true);

    console.log(formData);
  };



  

  return {
   
    formData,
    handleChange,
    handleImageChange,
    handleSubmit,
    setFormData,
    showPayment,
    setShowPayment
  };
};

export default useDispatchForm;
