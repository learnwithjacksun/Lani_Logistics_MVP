import { AuthContext } from "../Contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ID, Models } from "appwrite";
import { account, databases, DB, USERS } from "../Backend/appwriteConfig";
import toast from "react-hot-toast";
import { useMail, useNotifications } from "../hooks";

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
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const {sendEmail} = useMail();
  const {createNotifications} = useNotifications();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userData, setUserData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

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
      const exists = await account.get();
      if (exists) {
        toast.error("Email already registered");
        return;
      }
      accountResponse = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
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
      await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      setUser(accountDetails);
      setUserData(userData);
      if (userData) {
        if (userData?.role === "rider") {
          await navigate("/location");
        } else {
          await navigate("/dashboard");
        }
      }
      await sendEmail(email, "Welcome to Lani Logistics", "Thank you for registering with us");
      await createNotifications(
      {
        title: "Welcome to Lani Logistics",
        type: "system",
        content: "Thank you for registering with us",
        path: "/dashboard", 
      }, accountResponse.$id);
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
        await navigate("/rider-dashboard");
      } else {
        await navigate(redirectTo);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error((error as Error).message);
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
    if (!user) return;

    try {
      const updatedUser = await databases.updateDocument(DB, USERS, user.$id, {
        location: city,
      });
      setUserData(updatedUser as Models.Document);
      navigate("/rider-dashboard");
    } catch (error) {
      console.error("Update location error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserLocation,
    userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
