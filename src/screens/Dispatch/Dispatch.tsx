import {
  MapPin,
  Package,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  X,
  Clock,
  User,
  Phone,
  Info,
} from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Input } from "../../components/Common";
import { useDispatchForm } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { City } from "../../types/dispatch";
import Payment from "./Payment";
import ScrollToTop from "../../components/Common/ScrollToTop";
import PlacesAutocomplete, {
  geocodeByAddress,
  // geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { calculatePrice } from "../../utils/helper";
import { AnimatePresence, motion } from "framer-motion";

const cities: City[] = [
  // rate is in naira per km
  { name: "Uyo", state: "Akwa Ibom", rate: 50 },
  { name: "Port Harcourt", state: "Rivers", rate: 50 },
  { name: "Abeokuta", state: "Ogun", rate: 50 },
];

const Dispatch = () => {
  const {
    formData,
    handleChange,
    handleImageChange: handleFormImageChange,
    setFormData,
    handleSubmit,
    showPayment,
    setShowPayment,
  } = useDispatchForm();

  const [showCityList, setShowCityList] = useState(false);

  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState<string>("");

  const [pickup, setPickup] = useState({ lat: 0, lon: 0 });
  const [delivery, setDelivery] = useState({ lat: 0, lon: 0 });
  const ratePerKm = selectedCity.rate;

  const totalAmount = (
    calculatePrice(pickup, delivery, selectedCity.rate) -
    (formData.pickupTime === "scheduled" ? 100 : 0)
  ).toFixed(2); // Calculate total amount

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
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
    setShowCityList(false);
    setFormData((prev) => ({
      ...prev,

      deliveryCity: city.name,
    }));
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    handleFormImageChange(undefined);
  };

  const handleAddressChange = (address: string) => {
    setFormData((prev) => ({
      ...prev,
      pickupAddress: address,
    }));
  };

  const handleSelect = async (address: string) => {
    const results = await geocodeByAddress(address);
    const latLng = await getLatLng(results[0]);
    handleAddressSelect(address, latLng.lat, latLng.lng);
  };

  const handleAddressSelect = (address: string, lat: number, lon: number) => {
    console.log(
      `Selected Address: ${address}, Latitude: ${lat}, Longitude: ${lon}`
    );
    setFormData((prev) => ({
      ...prev,
      pickupAddress: address,
      pickupLatitude: lat,
      pickupLongitude: lon,
    }));
    setPickup({ lat, lon });
  };

  const handleDeliveryAddressChange = (
    address: string,
    lat: number,
    lon: number
  ) => {
    setDeliveryAddress(address);
    setFormData((prev) => ({
      ...prev,
      deliveryAddress: address,
      deliveryLatitude: lat,
      deliveryLongitude: lon,
    }));
    setDelivery({ lat, lon });
  };

  const handleDeliverySelect = async (address: string) => {
    const results = await geocodeByAddress(address);
    const latLng = await getLatLng(results[0]);
    console.log(
      `Selected Delivery Address: ${address}, Latitude: ${latLng.lat}, Longitude: ${latLng.lng}`
    );
    handleDeliveryAddressChange(address, latLng.lat, latLng.lng);
  };

  const handleCalculatePrice = useCallback(() => {
    const price = calculatePrice(pickup, delivery, ratePerKm);
    console.log(`Total Price: ₦${price.toFixed(2)}`);
    setFormData((prev) => ({
      ...prev,
      amount: price,
    }));
  }, [pickup, delivery, ratePerKm, setFormData]);

  useEffect(() => {
    handleCalculatePrice();
  }, [pickup, delivery, selectedCity, handleCalculatePrice]);

  if (showPayment) {
    return (
      <>
        <ScrollToTop />
        <Payment
          deliveryDetails={formData}
          onPaymentClose={handlePaymentClose}
          selectedCity={selectedCity.name}
          totalAmount={totalAmount}
        />
      </>
    );
  }

  return (
    <DashboardLayout title="Request Dispatch">
      {/* Main Container */}
      <div className="max-w-full mx-auto">
        {/* City Selection */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-sub mb-2">
            Select your city
          </h4>

          <div className="relative">
            <div
              onClick={() => setShowCityList(!showCityList)}
              className="flex items-center gap-2 justify-between h-10 bg-background text-main px-4 rounded-lg border border-line cursor-pointer"
            >
              <span className="text-sm font-dm">
                {selectedCity.name ? selectedCity.name : "Choose a city"}
              </span>
              <ChevronDown size={18} className="text-sub" />
            </div>

            <AnimatePresence>
              {showCityList && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full mt-2 rounded-lg border border-line shadow-xl bg-mid z-10"
                >
                  <ul>
                    {cities.map((city) => (
                      <li
                        onClick={() => handleCitySelect(city)}
                        key={city.name}
                        className="p-2 border-b border-line hover:bg-background_2 last:border-b-0 text-main flex items-center gap-2"
                      >
                        <div>
                          <span>{city.name}</span> <br />{" "}
                          <span className="text-xs text-sub">{city.state}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Delivery Form */}
        <div className=" md:border border-line rounded-2xl overflow-hidden">
          <div className="md:px-6 py-4 border-b border-line">
            <h3 className="font-semibold text-xl text-main">
              Delivery Details
            </h3>
            <p className="text-sub text-sm mt-1 font-dm">
              Fill in the delivery information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="md:px-6 py-6 space-y-8">
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
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <PlacesAutocomplete
                    value={formData.pickupAddress}
                    onChange={(address) => handleAddressChange(address)}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="relative">
                        <div className="w-full">
                          <label className="block text-sm text-sub font-medium mb-1">
                            Pickup Address
                          </label>
                          <input
                            className="w-full px-4 h-10 rounded-lg border border-line focus:border-primary_1 bg-background text-xs text-main placeholder:text-sub placeholder:text-sm"
                            name="pickupAddress"
                            {...getInputProps({
                              placeholder: `Enter pickup address in ${selectedCity.name}`,
                            })}
                          />
                        </div>

                        {loading && <div>Loading...</div>}
                        {
                          suggestions &&(
                            <ul className="absolute top-full left-0 mt-2 w-full bg-mid z-10 rounded-lg">
                            {suggestions.map((suggestion) => (
                              <li
                                {...getSuggestionItemProps(suggestion)}
                                key={suggestion.placeId}
                                className="p-2 border-b border-line text-main flex items-center gap-2"
                              >
                                <MapPin size={16} className="text-sub" />
                                <span className="text-sm">
                                  {suggestion.description}
                                </span>
                              </li>
                            ))}
                          </ul>
                          )
                        }
                       
                      </div>
                    )}
                  </PlacesAutocomplete>

                  <Input
                    label="Landmark (Optional)"
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
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <PlacesAutocomplete
                    value={deliveryAddress}
                    onChange={(address) =>
                      handleDeliveryAddressChange(address, 0, 0)
                    }
                    onSelect={handleDeliverySelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="relative">
                        <div className="w-full">
                          <label className="block text-sm text-sub font-medium mb-1">
                            Delivery Address
                          </label>
                          <input
                            className="w-full px-4 h-10 rounded-lg border border-line focus:border-primary_1 bg-background text-xs text-main placeholder:text-sub placeholder:text-sm"
                            {...getInputProps({
                              placeholder: `Enter delivery address`,
                            })}
                          />
                        </div>

                        {loading && <div>Loading...</div>}
                        <ul className="absolute top-full left-0 mt-2 w-full shadow-xl bg-mid z-10 rounded-lg">
                          {suggestions.map((suggestion) => (
                            <li
                              {...getSuggestionItemProps(suggestion)}
                              key={suggestion.placeId}
                              className="p-2 border-b border-line text-main flex items-center gap-2"
                            >
                              <MapPin size={16} className="text-sub" />
                              <span className="text-sm">
                                {suggestion.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </PlacesAutocomplete>

                  <Input
                    label="Landmark (Optional)"
                    name="deliveryLandmark"
                    value={formData.deliveryLandmark}
                    placeholder="Nearest landmark"
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
                            <p className="text-main text-sm font-medium">
                              Add Package Image
                            </p>
                            <p className="text-sub text-xs">
                              PNG, JPG or JPEG (max. 5MB)
                            </p>
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
            <div className="bg-background_2 p-4 rounded-xl space-y-2">
              <h3 className="font-medium text-main">Price Summary</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sub">Base Price</span>
                <div className="text-right">
                  {/* <span className="line-through text-sub">
                    ₦{formData.amount}
                  </span> */}
                  <span className="text-main ml-2">
                    ₦
                    {calculatePrice(
                      pickup,
                      delivery,
                      selectedCity.rate
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              {formData.pickupTime === "scheduled" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sub">Scheduled Delivery Discount</span>
                  <span className="text-red-500">-₦100</span>
                </div>
              )}
              <div className="pt-2 border-t border-line flex items-center justify-between font-medium">
                <span className="text-main">Total</span>
                <span className="text-primary_1">₦{totalAmount}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Info size={18} className="text-orange-500" />
                <p className="text-sm text-sub">Promo Prices 🎉</p>
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
                  <label
                    className={`flex-1 justify-between border border-line rounded-lg p-4 flex items-center gap-3 cursor-pointer
                            ${
                              formData.pickupTime === "immediate"
                                ? "border-primary_1"
                                : "border-line hover:border-primary_1"
                            }`}
                  >
                    <input
                      type="radio"
                      name="pickupTime"
                      value="immediate"
                      checked={formData.pickupTime === "immediate"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-left">
                      <h3 className="font-medium text-main">Immediate</h3>
                    </div>
                    <CheckCircle2
                      size={20}
                      className={
                        formData.pickupTime === "immediate"
                          ? "text-primary_1"
                          : "text-sub"
                      }
                    />
                  </label>

                  <label
                    className={`flex-1 border border-line justify-between rounded-lg p-4 flex items-center gap-3 cursor-pointer
                            ${
                              formData.pickupTime === "scheduled"
                                ? "border-primary_1"
                                : "border-line hover:border-primary_1"
                            }`}
                  >
                    <input
                      type="radio"
                      name="pickupTime"
                      value="scheduled"
                      checked={formData.pickupTime === "scheduled"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="text-left">
                      <h3 className="font-medium text-main">Schedule</h3>
                    </div>
                    <CheckCircle2
                      size={20}
                      className={
                        formData.pickupTime === "scheduled"
                          ? "text-primary_1"
                          : "text-sub"
                      }
                    />
                  </label>
                </div>

                {formData.pickupTime === "scheduled" && (
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
