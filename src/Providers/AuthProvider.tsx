import { AuthContext } from "../Contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ID, Models, Query } from "appwrite";
import { account, databases, DB, USERS } from "../Backend/appwriteConfig";
import { useMail} from "../hooks";
import toast from "react-hot-toast";
import { welcomeEmailTemplate } from "../Templates/emails";

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
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userData, setUserData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Models.Document[]>([]);

  const checkUser = useCallback(async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
      await getUserData(accountDetails.$id);
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: "customer" | "rider"
  ) => {
    setLoading(true);

    try {
      const res = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      await createUserData(res.$id, name, email, phone, role);
      await getUserData(res.$id);
      setUser(accountDetails);
      console.log("registered", res);

      if (role === "rider") {
        await navigate("/location");
      } else {
        await navigate("/dashboard");
      }

      sendEmail(
        email,
        "Jackson from Lani Logistics",
        welcomeEmailTemplate(
          name,
          "https://www.lani.ng/dashboard"
        )
      );
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createUserData = async (
    userId: string,
    name: string,
    email: string,
    phone: string,
    role: string
  ) => {
    try {
      const userData = await databases.createDocument(DB, USERS, userId, {
        userId,
        name,
        email,
        phone,
        role,
      });
      console.log(userData);
    } catch (error) {
      console.error("Create user data error:", error);
      throw new Error((error as Error).message);
    }
  };

  const getUserData = async (userId: string) => {
    try {
      if (!userId){
        throw new Error("User ID not found");
      }
      const userData = await databases.getDocument(DB, USERS, userId);
      setUserData(userData);
    } catch (error) {
      console.error("Get user data error:", error);
      throw new Error((error as Error).message);
    }
  };

  const login = async (
    email: string,
    password: string,
    redirectTo: string = "/dashboard"
  ) => {
    setLoading(true);
    try {
      if (user) {
        await account.deleteSession("current");
      }
      const res = await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      await getUserData(accountDetails.$id);
      setUser(accountDetails);
      console.log(res)

      if (userData) {
        if (userData?.role === "rider") {
          navigate("/rider-dashboard");
        } else {
          navigate(redirectTo);
        }
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
      throw new Error((error as Error).message);
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
