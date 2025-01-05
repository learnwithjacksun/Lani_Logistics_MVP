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
} from "../Backend/appwriteConfig";
import { useAuth, useMail, useNotifications } from "../hooks";
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
}
const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { sendEmail } = useMail();
  const { createNotifications } = useNotifications();
  const { user, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Models.Document[]>([]);
  const [allOrders, setAllOrders] = useState<Models.Document[]>([]);

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
          customerId: user?.$id,
          city: selectedCity,
          price: data.amount,
          pickupAddress: data.pickupAddress,
          pickupLandmark: data.pickupLandmark,
          deliveryAddress: data.deliveryAddress,
          deliveryLandmark: data.deliveryLandmark,
          notes: data.notes,
          time: data.pickupTime,
          scheduledDate: data.pickupDate,
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          packageName: data.packageName,
          packageTexture: data.packageTexture,
          packageImage: packageImage?.$id,
          senderName: user?.name,
          senderPhone: userData?.phone,
          senderEmail: user?.email,
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
      if (user?.email) {
        sendEmail(
          user?.email,
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
    if (!user?.$id) return;
    try {
      const orders = await databases.listDocuments(DB, DISPATCH, [
        Query.or([
          Query.equal("customerId", user?.$id),
          Query.equal("riderId", user?.$id),
        ]),
        Query.orderDesc("$createdAt"),
      ]);
      setOrders(orders.documents);
    } catch (error) {
      console.error(error);
    }
  }, [user?.$id]);

  const getAllOrders = useCallback(async () => {
    if (!user?.$id || !userData?.location) return;
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
  }, [user?.$id, userData?.location]);

  useEffect(() => {
    getUserOrders();
    getAllOrders();
  }, [getUserOrders, getAllOrders, user?.$id]);

  const acceptOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      // Check number of active orders for this rider
      const activeOrders = orders.filter(
        order => order.riderId === user?.$id && order.status === "in-transit"
      );

      if (activeOrders.length >= 2) {
        throw new Error("You can only handle 2 orders at a time. Please complete your current orders first.");
      }

      const res = await databases.updateDocument(DB, DISPATCH, orderId, {
        status: "in-transit",
        riderId: user?.$id,
        riderName: user?.name,
        riderPhone: userData?.phone,
      });
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
        }
      }
    );

    return () => unsubscribe();
  }, [getAllOrders, getUserOrders, orders]);

  const value: OrderContextType = {
    createDispatchOrder,
    isLoading,
    orders,
    allOrders,
    acceptOrder,
    completeOrder,
    updatePaymentStatus,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
