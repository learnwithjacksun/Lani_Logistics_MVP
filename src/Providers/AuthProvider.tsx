import { AuthContext } from "../Contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ID, Models, Query } from "appwrite";
import { account, databases, DB, USERS } from "../Backend/appwriteConfig";
import { useMail, useNotifications } from "../hooks";
import toast from "react-hot-toast";

export interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: "customer" | "rider"
  ) => Promise<void>;
  login: (email: string, password: string, redirectTo: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserLocation?: (city: string) => Promise<void>;
  userData: Models.Document | null;
  resetPassword: (email: string) => Promise<void>;
  newPassword: (
    password: string,
    userId: string,
    secret: string
  ) => Promise<void>;
  users: Models.Document[];
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { sendEmail } = useMail();
  const { createNotifications } = useNotifications();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userData, setUserData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Models.Document[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const accountDetails = await account.get();
      if (accountDetails) {
        const userData = await databases.getDocument(
          DB,
          USERS,
          accountDetails.$id
        );
        setUser(accountDetails);
        setUserData(userData);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: "customer" | "rider"
  ) => {
    setLoading(true);
    let accountResponse;

    try {
      accountResponse = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      const userData = await databases.createDocument(
        DB,
        USERS,
        accountResponse.$id,
        {
          name,
          email,
          phone,
          role,
        }
      );
      setUser(accountDetails);
      setUserData(userData);
      if (userData) {
        if (userData?.role === "rider") {
          await navigate("/location");
        } else {
          await navigate("/dashboard");
        }
      }
      sendEmail(
        email,
        "Welcome to Lani Logistics",
        "Thank you for registering with us"
      );
      await createNotifications(
        {
          title: "Welcome to Lani Logistics",
          type: "system",
          content: "Thank you for registering with us",
          path: "/dashboard",
        },
        accountResponse.$id
      );
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    redirectTo: string = "/dashboard"
  ) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      const userData = await databases.getDocument(
        DB,
        USERS,
        accountDetails.$id
      );
      setUser(accountDetails);
      setUserData(userData);

      if (userData?.role === "rider") {
        navigate("/rider-dashboard");
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw (error as Error).message || "Login failed. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserLocation = async (city: string) => {
    setLoading(true);
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      const updatedUser = await databases.updateDocument(DB, USERS, user.$id, {
        location: city,
      });
      setUserData(updatedUser as Models.Document);
      await navigate("/rider-dashboard");
    } catch (error) {
      console.error("Update location error:", error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/new-password`
      );
      toast.success("Reset link sent to email");
    } catch (error) {
      console.error("Reset password error:", error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const newPassword = async (
    password: string,
    userId: string,
    secret: string
  ) => {
    setLoading(true);
    try {
      await account.updateRecovery(userId, secret, password);
      await navigate("/login");
    } catch (error) {
      console.error("New password error:", error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await databases.listDocuments(DB, USERS, [
        Query.orderDesc("$createdAt"),
      ]);
      console.log(data);
      setUsers(data.documents);
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserLocation,
    userData,
    resetPassword,
    newPassword,
    users,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
