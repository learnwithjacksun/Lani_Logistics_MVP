import { useContext } from "react";
import { OrderContext } from "../Contexts/OrderContext";

const useOrder = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }

  const { 
    createDispatchOrder, 
    isLoading, 
    orders, 
    acceptOrder, 
    allOrders, 
    completeOrder,
    updatePaymentStatus 
  } = context;

  return { 
    createDispatchOrder, 
    isLoading, 
    orders, 
    acceptOrder, 
    allOrders, 
    completeOrder,
    updatePaymentStatus 
  };
};

export default useOrder;
