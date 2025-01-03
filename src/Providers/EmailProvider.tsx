import { EmailContext } from "../Contexts/EmailContext";
import { createClient } from "smtpexpress";

export interface EmailProviderContextType {
  sendEmail: (email: string, subject: string, message: string) => void;
}

const smtpexpressClient = createClient({
  projectId: import.meta.env.VITE_SMTP_EXPRESS_PROJECT_ID,
  projectSecret: import.meta.env.VITE_SMTP_EXPRESS_PROJECT_SECRET,
});

const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const sendEmail = async (email: string, subject: string, message: string) => {
    smtpexpressClient.sendApi.sendMail({
      subject,
      message: message,
      sender: {
        name: "Lani Logistics",
        email: "lani-logistics-621304@projects.smtpexpress.com",
      },
      recipients: email,
    });
  };    

  return <EmailContext.Provider value={{sendEmail}}>{children}</EmailContext.Provider>;
};

export default EmailProvider;
