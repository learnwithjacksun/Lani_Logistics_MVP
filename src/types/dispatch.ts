export interface City {
  name: string;
  state: string;
  rate: number;
}

export interface DeliveryLocation {
  address: string;
  landmark: string;
}

export type PackageTexture = 'breakable' | 'non-breakable' | 'perishable';

export interface PackageDetails {
  name: string;
  texture: PackageTexture;
  notes?: string;
}

export type FileInputEvent = {
  target: {
    value: File | null;
  };
};

export type PickupTime = 'immediate' | 'scheduled';

export interface FormData {
  pickupAddress: string;
  pickupLandmark: string;
  deliveryAddress: string;
  deliveryLandmark: string;
  packageName: string;
  packageTexture: PackageTexture;
  notes?: string;
  amount: number;
  packageImage: File | null;
  pickupTime: PickupTime;
  pickupDate: string; // ISO string for scheduled pickup
}  

export interface Rider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  distance: string;
  eta: string;
  image: string;
  completedDeliveries: number;
}

export interface DeliveryRequest {
  id: string;
  city: City;
  pickup: DeliveryLocation;
  delivery: DeliveryLocation;
  package: PackageDetails;
  amount: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
  rider?: Rider;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'in-transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  trackingId: string;
  amount: number;
  city: string;
  package: {
    name: string;
    texture: PackageTexture;
    image?: string;
  };
  pickup: {
    address: string;
    landmark: string;
    time: string;
    scheduled?: string;
  };
  delivery: {
    address: string;
    landmark: string;
  };
} 