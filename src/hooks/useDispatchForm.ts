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
  const [formData, setFormData] = useState<DispatchForm>({
    packageName: "",
    packageTexture: "non-breakable",
    pickupAddress: "",
    pickupLandmark: "",
    deliveryAddress: "",
    deliveryLandmark: "",
    notes: "",
    pickupTime: "immediate",
    pickupDate: "",
    receiverName: "",
    receiverPhone: "",
    amount: 1600,
    deliveryCity: "Uyo"
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Validate phone number only when it's being entered
    // if (name === 'receiverPhone') {
    //   const phoneRegex = /^(\+234|0)[789][01]\d{0,8}$/;
    //   if (value && !phoneRegex.test(value)) {
    //     toast.error('Please enter a valid Nigerian phone number');
    //     return;
    //   }
    // }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
