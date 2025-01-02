import { useCallback, useEffect, useState } from "react";
import { OrderContext } from "../Contexts/OrderContext";
import { DispatchForm } from "../hooks/useDispatchForm";
import { ID, Models, Query } from "appwrite";
import {
  databases,
  DB,
  DISPATCH,
  STORAGE,
  storage,
} from "../Backend/appwriteConfig";
import { useAuth, useNotifications } from "../hooks";
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

}
const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const {createNotifications} = useNotifications()
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
          trackingId: id,
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
        }
      );
      console.log(response);
      const notification = {
        title: "Order Created!",
        type: "order",
        content: `Your order has been placed successfully, and your tracking Id is ${response?.trackingId}. \n A rider will be assigned shortly!`,
        path: response?.trackingId,
      };
      const notifyId = response?.customerId
      await createNotifications(notification, notifyId )
      navigate("/dashboard");
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
        Query.orderDesc("$createdAt")
      ]);
      setOrders(orders.documents);
    } catch (error) {
      console.error(error);
    }
  }, [user?.$id]);

  const getAllOrders = useCallback(async () => {
    if (!user?.$id) return;
    try {
      const orders = await databases.listDocuments(DB, DISPATCH, [
        Query.equal("status", "pending"),
        Query.orderDesc("$createdAt")
      ]);
      setAllOrders(orders.documents);
    } catch (error) {
      console.error(error);
    }
  }, [user?.$id]);

  useEffect(() => {
    getUserOrders();
    getAllOrders();
  }, [getUserOrders, getAllOrders, user?.$id]);

  const acceptOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const res = await databases.updateDocument(DB, DISPATCH, orderId, {
        status: "in-transit",
        riderId: user?.$id,
        riderName: user?.name,
        riderPhone: userData?.phone,
      });
      const customerNotification = {
        title: "Order Status Update!",
        type: "order",
        content: `A rider, ${res?.riderName} has been assigned to your order, #${res?.trackingId}!`,
        path: res?.trackingId,
        activity: `A rider, ${res?.riderName} has been assigned to your order, #${res?.trackingId}!`
      };
      const riderNotification = {
        title: "Order Status Update!",
        type: "order",
        content: `You accepted an order by ${res?.senderName}, with a trackingId of #${res?.trackingId}!`,
        path: res?.trackingId,
        activity: `You accepted an order by ${res?.senderName}, with a trackingId of #${res?.trackingId}!`
      };
      const customerNotifyId = res?.customerId
      await createNotifications(customerNotification, customerNotifyId )
      const riderNotifyId = res?.riderId
      await createNotifications(riderNotification, riderNotifyId )
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      if (!orderId) throw new Error('Order ID is required');

      const order = await databases.updateDocument(
        DB,
        DISPATCH,
        orderId,
        {
          status: 'delivered'
        }
      );

      setOrders(prevOrders => 
        prevOrders.map(o => o.$id === orderId ? { ...o, status: 'delivered' } : o)
      );

      // customer notification
      await createNotifications({
        title: "Order Status Update!",
        type: "success",
        content: `Your order has been delivered successfully, #${order?.trackingId}!`,
        path: order?.trackingId,
      }, order?.customerId) 

      // rider notification
      await createNotifications({
        title: "Order Status Update!",
        type: "success",
        content: `You have completed an order by ${order?.senderName}, with a trackingId of #${order?.trackingId}!`,
        path: order?.trackingId,
      }, order?.riderId) 
      return order;
    } catch (error) {
      console.error('Complete order error:', error);
      throw new Error('Failed to complete order');
    }
  };

  const value: OrderContextType = {
    createDispatchOrder,
    isLoading,
    orders,
    allOrders,
    acceptOrder,
    completeOrder
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
