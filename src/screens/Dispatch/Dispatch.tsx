import { MapPin, Package, Info, ArrowRight, CheckCircle2, ChevronDown, ImageIcon, X, Clock, User, Phone } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Input } from "../../components/Common";
import { useDispatchForm } from "../../hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import { City } from "../../types/dispatch";
import Payment from "./Payment";

const cities: City[] = [
  { name: "Uyo", state: "Akwa Ibom", basePrice: 1600 },
  { name: "Port Harcourt", state: "Rivers", basePrice: 2500 }
];

const Dispatch = () => {
  const {
    formData,
    handleChange,
    handleImageChange: handleFormImageChange,
    setFormData,
    handleSubmit,
    showPayment,
    setShowPayment
  } = useDispatchForm();

  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
 
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleFormImageChange(file);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setFormData(prev => ({
      ...prev,
      amount: city.basePrice,
      deliveryCity: city.name
    }));
  };

  



  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    handleFormImageChange(undefined);
  };

  if (showPayment) {
    return (
      <Payment 
        deliveryDetails={formData}  
        onPaymentClose={handlePaymentClose}
        selectedCity={selectedCity.name}
      />
    );
  }

  return (
    <DashboardLayout title="Request Dispatch">
      {/* Main Container */}
      <div className="max-w-full mx-auto">
        {/* City Selection */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-sub mb-4">Select your city</h4>
          <div className="grid grid-cols-2 gap-4">
            {cities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleCitySelect(city)}
                className={`group relative p-6 border rounded-2xl text-left transition-all ${
                  selectedCity.name === city.name 
                    ? "border-primary_1 bg-primary_1/5" 
                    : "border-line hover:border-primary_1"
                }`}
              >
                <CheckCircle2 
                  size={20} 
                  className={`absolute top-4 right-4 transition-all ${
                    selectedCity.name === city.name
                      ? "text-primary_1 scale-110" 
                      : "text-line group-hover:text-sub"
                  }`}
                />
                <h3 className="font-semibold text-base text-main">{city.name}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Form */}
        <div className=" border border-line rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-line">
            <h3 className="font-semibold text-xl text-main">Delivery Details</h3>
            <p className="text-sub text-sm mt-1 font-dm">Fill in the delivery information</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Locations */}
            <div className="relative">
              {/* <div className="absolute left-[17px] top-[76px] bottom-4 w-[2px] bg-line" /> */}
              
              {/* Pickup Location */}
              <div className="relative space-y-4">
                <h4 className="text-sm font-medium text-main flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-primary_1/10">
                    <MapPin size={18} className="text-primary_1" />
                  </div>
                  Pickup Location
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Address"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    placeholder={`Enter pickup address in ${selectedCity.name}`}
                    onChange={handleChange}
                  />
                  <Input
                    label="Landmark"
                    name="pickupLandmark"
                    value={formData.pickupLandmark}
                    placeholder="Nearest landmark"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Delivery Location */}
              <div className="relative space-y-4 mt-8">
                <h4 className="text-sm font-medium text-main flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-primary_2/10">
                    <MapPin size={18} className="text-primary_2" />
                  </div>
                  Delivery Location
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Address"
                    placeholder="Enter delivery address"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                  />
                  <Input
                    label="Landmark"
                    placeholder="Nearest landmark"
                    name="deliveryLandmark"
                    value={formData.deliveryLandmark}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4 border-t border-line pt-8">
              <h4 className="text-sm font-medium text-main flex items-center gap-2">
                <div className="p-1 rounded-lg bg-primary_1/10">
                  <Package size={18} className="text-primary_1" />
                </div>
                Package Details
              </h4>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <Input
                    label="Package Name"
                    placeholder="What are you sending?"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-main">
                      Package Texture
                    </label>
                    <div className="relative">
                      <select
                        name="packageTexture"
                        value={formData.packageTexture}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-line
                          focus:border-primary_1 bg-background text-main
                          appearance-none cursor-pointer pr-10"
                      >
                        <option value="non-breakable">Non-Breakable</option>
                        <option value="breakable">Breakable</option>
                        <option value="perishable">Perishable</option>
                      </select>
                      <ChevronDown 
                        size={18} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sub pointer-events-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-main">
                      Package Image
                    </label>
                    <div className="relative w-full">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleImageChange}
                        className="hidden"
                        id="packageImage"
                      />
                      {!imagePreview ? (
                        <label
                          htmlFor="packageImage"
                          className="w-full p-8 border border-dashed border-line rounded-lg
                            flex flex-col items-center gap-2 cursor-pointer
                            hover:border-primary_1 transition-colors"
                        >
                          <ImageIcon size={24} className="text-sub" />
                          <div className="text-center">
                            <p className="text-main text-sm font-medium">Add Package Image</p>
                            <p className="text-sub text-xs">PNG, JPG or JPEG (max. 5MB)</p>
                          </div>
                        </label>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Package preview"
                            className="w-full h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 rounded-full
                              bg-background hover:bg-background
                              text-main hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Input
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                placeholder="Any special instructions?"
                onChange={handleChange}
              />
            </div>

            {/* Receiver Details - Added after package details */}
            <div className="space-y-4 border-t border-line pt-8">
              <h4 className="text-sm font-medium text-main flex items-center gap-2">
                <div className="p-1 rounded-lg bg-primary_1/10">
                  <User size={18} className="text-primary_1" />
                </div>
                Receiver Details
              </h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Receiver's Name"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="Enter receiver's name"
                  icon={<User size={18} />}
                  
                />

                <Input
                  label="Receiver's Phone"
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  placeholder="Enter receiver's phone number"
                  icon={<Phone size={18} />}
                  
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="border border-line bg-background rounded-xl p-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-primary_1" />
                <h4 className="font-medium text-main">Price Summary</h4>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sub">Base Price</span>
                <span className="text-main font-medium">₦{selectedCity.basePrice.toLocaleString()}</span>
              </div>
              
              {/* You can add more price details here if needed */}
              {/* <div className="flex items-center justify-between mb-2">
                <span className="text-sub">Distance Fee</span>
                <span className="text-main font-medium">₦500</span>
              </div> */}
              
              <div className="border-t border-line my-3" />
              
              <div className="flex items-center justify-between">
                <span className="font-medium text-main">Total Amount</span>
                <span className="text-lg font-semibold text-primary_1">
                  ₦{selectedCity.basePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Pickup Time */}
            <div className=" space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary_1/10">
                  <Clock size={20} className="text-primary_1" />
                </div>
                <div>
                  <h2 className="font-medium text-main">Pickup Time</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex-1 border border-line rounded-lg p-4 flex items-center gap-3 cursor-pointer
                    ${formData.pickupTime === 'immediate' ? 'border-primary_1' : 'border-line hover:border-primary_1'}"
                  >
                    <input
                      type="radio"
                      name="pickupTime"
                      value="immediate"
                      checked={formData.pickupTime === 'immediate'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <CheckCircle2 
                      size={20} 
                      className={formData.pickupTime === 'immediate' ? 'text-primary_1' : 'text-sub'} 
                    />
                    <div className="text-left">
                      <h3 className="font-medium text-main">Immediate</h3>
                    </div>
                  </label>

                  <label className="flex-1 border border-line rounded-lg p-4 flex items-center gap-3 cursor-pointer
                    ${formData.pickupTime === 'scheduled' ? 'border-primary_1' : 'border-line hover:border-primary_1'}"
                  >
                    <input
                      type="radio"
                      name="pickupTime"
                      value="scheduled"
                      checked={formData.pickupTime === 'scheduled'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <CheckCircle2 
                      size={20} 
                      className={formData.pickupTime === 'scheduled' ? 'text-primary_1' : 'text-sub'} 
                    />
                    <div className="text-left">
                      <h3 className="font-medium text-main">Schedule</h3>
                    </div>
                  </label>
                </div>

                {formData.pickupTime === 'scheduled' && (
                  <div>
                    <Input
                      type="datetime-local"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2 rounded-lg border border-line
                        focus:border-primary_1 bg-background text-main
                        appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 btn btn-primary py-4 rounded-xl text-lg mt-6"
            >
              <span>Request Dispatch</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dispatch;