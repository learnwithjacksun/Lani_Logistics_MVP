import { ID, Models, Query } from "appwrite";
import client, {
  databases,
  NOTIFICATIONS,
  DB,
} from "../Backend/appwriteConfig";
import { NotificationContext } from "../Contexts/NotificationContext";
import { Notification } from "../types/notification";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks";

export interface NotificationContextType {
  createNotifications: (
    notification: Notification,
    id: string
  ) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  notifications: Models.Document[] | null;
  unreadCount: number;
  isLoading: boolean;
  markAsRead?: (notificationId: string) => Promise<void>;
}

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Models.Document[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
const {userData} = useAuth()






  const createNotifications = useCallback(async (
    notification: Notification,
    id: string
  ) => {
    try {
      const notificationDoc = await databases.createDocument(
        DB,
        NOTIFICATIONS,
        ID.unique(),
        {
          notificationId: id,
          type: notification.type,
          content: notification.content,
          title: notification.title,
          path: notification.path,
        }
      );
      console.log(notificationDoc);
      // await sendNotification(
      //   userId,
      //   notification.title,
      //   notification.content
      // );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const getNotifications = useCallback(async () => {
    try {
      if (!userData) return;
      const notifications = await databases.listDocuments(DB, NOTIFICATIONS, [
        Query.equal("notificationId", [userData?.$id]),
        Query.orderDesc("$createdAt"),

      ]);
      setNotifications(notifications.documents as Models.Document[]);
      console.log(notifications.documents)
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  }, [userData]);


  useEffect(() => {
    getNotifications();
  }, [getNotifications, userData, createNotifications]);


  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    }
  }, [notifications]);

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      const documents = await databases.listDocuments(DB, NOTIFICATIONS, [
        Query.equal("isRead", false),
      ]);
      for (const document of documents.documents) {
        await databases.updateDocument(DB, NOTIFICATIONS, document.$id, {
          isRead: true,
        });
      }
      toast.success("All notifications marked as read");
      await getNotifications();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await databases.updateDocument(DB, NOTIFICATIONS, notificationId, {
        isRead: true,
      });
      await getNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = client.subscribe(
      [`databases.${DB}.collections.${NOTIFICATIONS}.documents`],
      (response) => {
        const event = response.events[0];
        if (event.includes("create")) {
          getNotifications();
        } else if (event.includes("update")) {
          getNotifications();
        }
      }
    );
    return () => unsubscribe();
  }, [getNotifications]);

  const contextValue: NotificationContextType = {
    createNotifications,
    markAllAsRead,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
