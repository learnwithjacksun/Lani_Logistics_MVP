// import { useState } from 'react';
import { Bell, Package, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks';
import { NotificationType } from '../../types/notification';
import { Models } from 'appwrite';




const notificationStyles: Record<NotificationType, { 
  icon: typeof Package,
  iconColor: string,
  bgColor: string 
}> = {
  order: {
    icon: Package,
    iconColor: 'text-primary_1',
    bgColor: 'bg-orange-500/10'
  },
  system: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  alert: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  food: {
    icon: Package,
    iconColor: 'text-primary_1',
    bgColor: 'bg-orange-500/10'
  }
};



const Notifications = () => {
  const navigate = useNavigate();
  const {notifications, markAllAsRead, unreadCount, isLoading, markAsRead} = useNotifications() 

  

  const handleNotificationClick = (notification: Models.Document) => {
    // Mark as read
    if(markAsRead){
      markAsRead(notification?.$id)
    } 

    if (notification?.path && notification?.path !== '/') {
      navigate(`/history/${notification?.path}`);
    }
  };


  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // const unreadCount = notifications.filter(n => !n.isRead).length;
 console.log(notifications)

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-background_2">
              <Bell size={20} className="text-main" />
            </div>
            {unreadCount > 0 && (
              <span className="text-sm text-sub">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary_1 hover:text-primary_1/80"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Mark all as read'}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications?.length === 0 ? (
            <div className="text-center py-12 text-sub">
              No notifications yet
            </div>
          ) : (
            notifications?.map((notification) => {
              const NotificationIcon = notificationStyles[notification?.type as NotificationType].icon;
              return (
                <div
                  key={notification?.$id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 border rounded-xl cursor-pointer transition-all
                    ${notification?.isRead 
                      ? 'bg-background border-line hover:border-primary_1' 
                      : 'bg-background_2 border-primary_1'
                    }
                  `}
                >
                  <div className="flex gap-4">
                    <div className={`
                      p-2 rounded-xl shrink-0 h-fit
                      ${notificationStyles[notification?.type as NotificationType].bgColor}
                    `}>
                      <NotificationIcon 
                        size={20} 
                        className={notificationStyles[notification?.type as NotificationType].iconColor} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-main">{notification?.title}</h3>
                          <p className="text-sm text-sub mt-1">{notification?.content}</p>
                        </div>
                        <span className="text-xs text-sub shrink-0">
                          {formatTimestamp(new Date(notification?.$createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications; 