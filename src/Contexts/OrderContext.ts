import { createContext } from "react";
import { OrderContextType } from "../Providers/OrderProvider";


export const OrderContext = createContext<OrderContextType | null>(null);