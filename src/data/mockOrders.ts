import { Order } from "../types/dispatch";

export const mockOrders: Order[] = [
  {
    id: '1',
    createdAt: new Date(),
    status: 'pending',
    trackingId: 'TRK123456',
    amount: 1500,
    city: 'Uyo',
    package: {
      name: 'Documents',
      texture: 'non-breakable'
    },
    pickup: {
      address: '123 Main St',
      landmark: 'Near Park',
      time: 'immediate'
    },
    delivery: {
      address: '456 Side St',
      landmark: 'Near Market'
    }
  },
  {
    id: '2',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    status: 'in-transit',
    trackingId: 'TRK789012',
    amount: 2000,
    city: 'Port Harcourt',
    package: {
      name: 'Electronics',
      texture: 'breakable'
    },
    pickup: {
      address: '789 East Rd',
      landmark: 'Near School',
      time: 'scheduled',
      scheduled: new Date().toISOString()
    },
    delivery: {
      address: '321 West St',
      landmark: 'Near Hospital'
    }
  },
  {
    id: '3',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    status: 'delivered',
    trackingId: 'TRK345678',
    amount: 1500,
    city: 'Uyo',
    package: {
      name: 'Food Items',
      texture: 'perishable'
    },
    pickup: {
      address: '567 North Ave',
      landmark: 'Near Mall',
      time: 'immediate'
    },
    delivery: {
      address: '890 South Blvd',
      landmark: 'Near Station'
    }
  }
]; 