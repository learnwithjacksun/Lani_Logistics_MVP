import { useContext } from "react"
import { NotificationContext } from "../Contexts/NotificationContext"


const useNotifications = ()=>{
    const context = useContext(NotificationContext)

    if(!context) {
        throw new Error("useNotifications must be used within NotificationProvider")
    }

    const {
        createNotifications, markAllAsRead, notifications, unreadCount, isLoading, markAsRead
    } = context

    return {
        createNotifications, markAllAsRead, notifications, unreadCount, isLoading, markAsRead
    }
}

export default useNotifications