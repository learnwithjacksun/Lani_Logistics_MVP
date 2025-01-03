import { createContext } from "react";
import { EmailProviderContextType } from "../Providers/EmailProvider";

export const EmailContext = createContext<EmailProviderContextType>({
  sendEmail: () => {},
});
