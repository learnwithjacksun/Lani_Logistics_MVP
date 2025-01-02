export interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered';
  origin: string;
  destination: string;
  estimatedDelivery: Date;
  customer: {
    id: string;
    name: string;
    contact: string;
  };
} 