import { useCallback, useEffect, useState } from "react";
import { OrderContext } from "../Contexts/OrderContext";
import { DispatchForm } from "../hooks/useDispatchForm";
import { ID, Models, Query } from "appwrite";
import client, {
  databases,
  DB,
  DISPATCH,
  STORAGE,
  storage,
  USERS,
} from "../Backend/appwriteConfig";
import { useAuth, useMail, useMap, useNotifications } from "../hooks";
import { useNavigate } from "react-router-dom";
import { generateTrackingId } from "../utils/helpers";

export interface OrderContextType {
  createDispatchOrder: (
    data: DispatchForm,
    selectedCity: string
  ) => Promise<void>;
  isLoading: boolean;
  orders: Models.Document[];
  acceptOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string) => Promise<Models.Document>;
  allOrders: Models.Document[];
  updatePaymentStatus: (orderId: string, isPaid: boolean) => Promise<Models.Document>;
  parcelOrders: Models.Document[];
  parcelRevenue: number;
}
const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { sendEmail } = useMail();
  const { getLocation, location } = useMap();
  const { createNotifications } = useNotifications();
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Models.Document[]>([]);
  const [allOrders, setAllOrders] = useState<Models.Document[]>([]);
  const [parcelOrders, setParcelOrders] = useState<Models.Document[]>([]);
  const [parcelRevenue, setParcelRevenue] = useState(0);

  const createDispatchOrder = async (
    data: DispatchForm,
    selectedCity: string
  ) => {
    setIsLoading(true);
    try {
      if (!data.packageImage) throw new Error("Package image is required");
      const packageImage = await storage.createFile(
        STORAGE,
        ID.unique(),
        data.packageImage
      );
      const id = generateTrackingId();
      const response = await databases.createDocument(
        DB,
        DISPATCH,
        ID.unique(),
        {
          trackingId: `TRX-${id}`,
          customerId: userData?.$id,
          city: selectedCity,
          price: data.amount,
          pickupAddress: data.pickupAddress,
          pickupLandmark: data.pickupLandmark,
          deliveryAddress: data.deliveryAddress,
          deliveryLandmark: data.deliveryLandmark,
          pickupLatitude: data.pickupLatitude?.toString() || "0",
          pickupLongitude: data.pickupLongitude?.toString() || "0",
          deliveryLatitude: data.deliveryLatitude?.toString() || "0",
          deliveryLongitude: data.deliveryLongitude?.toString() || "0",
          notes: data.notes,
          time: data.pickupTime,
          scheduledDate: data.pickupDate,
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          packageName: data.packageName,
          packageTexture: data.packageTexture,
          packageImage: packageImage?.$id,
          senderName: userData?.name,
          senderPhone: userData?.phone,
          senderEmail: userData?.email,
          isPaid: data.paymentType === 'sender' ? true : false,
        }
      );
      console.log(response);
      const notification = {
        title: "Order Created!",
        type: "order",
        content: `Your order has been placed successfully, and your tracking Id is ${response?.trackingId}. \n A rider will be assigned shortly!`,
        path: response?.trackingId,
      };
      const notifyId = response?.customerId;
      await createNotifications(notification, notifyId);
      if (userData?.email) {
        sendEmail(
          userData?.email,
          "Order Created!",
          `Your order has been placed successfully, and your tracking Id is ${response?.trackingId}. \n A rider will be assigned shortly!`
        );
      }
      navigate("/pending-orders");
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserOrders = useCallback(async () => {
    if (!userData?.$id) return;
    try {
      const orders = await databases.listDocuments(DB, DISPATCH, [
        Query.or([
          Query.equal("customerId", userData?.$id),
          Query.equal("riderId", userData?.$id),
        ]),
        Query.orderDesc("$createdAt"),
      ]);
      setOrders(orders.documents);
    } catch (error) {
      console.error(error);
    }
  }, [userData?.$id]);

  const getAllOrders = useCallback(async () => {
    if (!userData?.$id || !userData?.location) return;
    try {
      const orders = await databases.listDocuments(DB, DISPATCH, [
        Query.equal("status", "pending"),
        Query.equal("city", userData.location),
        Query.orderDesc("$createdAt"),
      ]);
      setAllOrders(orders.documents);
    } catch (error) {
      console.error(error);
    }
  }, [userData?.$id, userData?.location]);

  const getParcelOrders = useCallback(async()=>{
    try {
      const orders = await databases.listDocuments(DB, DISPATCH, [
        Query.orderDesc("$createdAt"),
      ]);
      setParcelOrders(orders.documents);
      // calculate total revenue
      const totalRevenue = orders.documents.reduce((acc, order) => acc + order.price, 0);
      console.log(totalRevenue);
      setParcelRevenue(totalRevenue);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUserOrders();
    getAllOrders();
    getParcelOrders();
  }, [getUserOrders, getAllOrders, userData?.$id, getParcelOrders]);

  const acceptOrder = async (orderId: string) => {
    setIsLoading(true);
    getLocation();
    try {
      // Check number of active orders for this rider
      const activeOrders = orders.filter(
        order => order.riderId === userData?.$id && order.status === "in-transit"
      );

      if (activeOrders.length >= 2) {
        throw new Error("You can only handle 2 orders at a time. Please complete your current orders first.");
      }

      const res = await databases.updateDocument(DB, DISPATCH, orderId, {
        status: "in-transit",
        riderId: userData?.$id,
        riderName: userData?.name,
        riderPhone: userData?.phone,
        
      });

      if(userData?.$id){
        await databases.updateDocument(DB, USERS, userData?.$id, {
          riderLatitude: location?.lat, 
          riderLongitude: location?.lon 
        });
      }

      const customerNotification = {
        title: "Order Accepted!",
        type: "order",
        content: `A rider, ${res?.riderName} has been assigned to your order, ${res?.trackingId}!`,
        path: res?.trackingId,
        activity: `A rider, ${res?.riderName} has been assigned to your order, ${res?.trackingId}!`,
      };
      const riderNotification = {
        title: "Order Accepted!",
        type: "order",
        content: `You accepted an order by ${res?.senderName}, with a trackingId of ${res?.trackingId}!`,
        path: res?.trackingId,
        activity: `You accepted an order by ${res?.senderName}, with a trackingId of ${res?.trackingId}!`,
      };
      const customerNotifyId = res?.customerId;
      await createNotifications(customerNotification, customerNotifyId);
      const riderNotifyId = res?.riderId;
      await createNotifications(riderNotification, riderNotifyId);
      if (res?.customerId) {
        sendEmail(
          res?.senderEmail,
          "Order Accepted!",
          `A rider, ${res?.riderName} has been assigned to your order, ${res?.trackingId}!`
        );
      }
      navigate("/rider-dashboard");
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      if (!orderId) throw new Error("Order ID is required");

      const order = await databases.updateDocument(DB, DISPATCH, orderId, {
        status: "delivered",
      });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.$id === orderId ? { ...o, status: "delivered" } : o
        )
      );

      // customer notification
      await createNotifications(
        {
          title: "Order Completed!",
          type: "success",
          content: `Your order has been delivered successfully, ${order?.trackingId}!`,
          path: order?.trackingId,
        },
        order?.customerId
      );

      // rider notification
      await createNotifications(
        {
          title: "Order Completed!",
          type: "success",
          content: `You have completed an order by ${order?.senderName}, with a trackingId of ${order?.trackingId}!`,
          path: order?.trackingId,
        },
        order?.riderId
      );
      if (order?.senderEmail) {
        sendEmail(
          order?.senderEmail,
          "Order Delivered!",
          `Your order has been delivered successfully, ${order?.trackingId}!`
        );
      }
      return order;
    } catch (error) {
      console.error("Complete order error:", error);
      throw new Error("Failed to complete order");
    }
  };

  const updatePaymentStatus = async (orderId: string, isPaid: boolean) => {
    setIsLoading(true);
    try {
      const updatedOrder = await databases.updateDocument(DB, DISPATCH, orderId, {
        isPaid: isPaid
      });

      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.$id === orderId ? { ...order, isPaid } : order
        )
      );

      // Create notification for payment received
      if (isPaid) {
        const notification = {
          type: 'success',
          title: 'Payment Received',
          content: `Payment received for order #${updatedOrder.trackingId}`,
          path: updatedOrder.trackingId
        };
        await createNotifications(notification, updatedOrder.senderId);
      }

      return updatedOrder;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = client.subscribe(
      [`databases.${DB}.collections.${DISPATCH}.documents`],
      (response) => {
        const event = response.events[0];
        if (event.includes("create")) {
          getAllOrders();
          getUserOrders();
        } else if (event.includes("update")) {
          getAllOrders();
          getUserOrders();
          getParcelOrders();
        }
      }
    );

    return () => unsubscribe();
  }, [getAllOrders, getUserOrders, getParcelOrders]);

  const value: OrderContextType = {
    createDispatchOrder,
    isLoading,
    orders,
    allOrders,
    acceptOrder,
    completeOrder,
    updatePaymentStatus,
    parcelOrders,
    parcelRevenue
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
