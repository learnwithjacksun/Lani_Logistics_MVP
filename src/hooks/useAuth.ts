import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const {
    user,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserLocation,
  } = context;
  return {
    user,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserLocation,
  };
};

export default useAuth;
