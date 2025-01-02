import { createContext } from "react";
import { NotificationContextType } from "../Providers/NotificationProvider";

export const NotificationContext = createContext<NotificationContextType | null>(null)