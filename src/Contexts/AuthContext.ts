import { createContext } from "react";
import { AuthContextType } from "../Providers/AuthProvider";


export const AuthContext = createContext<AuthContextType | null>(null);