import { ID, Models, Query } from "appwrite";
import { databases, NOTIFICATIONS, DB } from "../Backend/appwriteConfig";
import { NotificationContext } from "../Contexts/NotificationContext";
import { Notification } from "../types/notification";
import { useAuth } from "../hooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface NotificationContextType {
  createNotifications: (notification: Notification, id:string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  notifications: Models.Document[] | null;
  unreadCount: number;
  isLoading: boolean;
  markAsRead?: (notificationId: string) => Promise<void>;
}

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Models.Document[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const createNotifications = async (notification: Notification, id:string) => {
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
          activity: notification.activity,

        }
      );
      console.log(notificationDoc);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getNotifications = useCallback(async () => {
    try {
      if (!user?.$id) return;
      const notifications = await databases.listDocuments(DB, NOTIFICATIONS, [
        Query.equal("notificationId", user?.$id),
        Query.orderDesc("$createdAt")
      ]);
      setNotifications(notifications.documents as Models.Document[]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [user?.$id]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.filter(n => !n.isRead).length);
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
      toast.success('All notifications marked as read');
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
    toast.success('Notification marked as read');
   } catch (error) {
    console.error(error);
    throw error;
   }
  };

  const contextValue: NotificationContextType = {
    createNotifications,
    markAllAsRead,
    notifications,
    unreadCount,
    isLoading,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
