import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";
import { useAuth } from "../../hooks";
import { useState } from "react";
import toast from "react-hot-toast";

const Reset = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    toast.promise(resetPassword(email), {
      loading: "Sending reset link...",
      success: () => {
        setIsEmailSent(true);
        return "Reset link sent to email";
      },
      error: ({error}) => error.message,
    });
  };

  if (isEmailSent) {
    return (
      <>
      <AuthLayout title="Reset Password 🔐" subtitle="Enter your email to receive a password reset link">
        <div className="flex flex-col gap-4">
          <p className="text-sub font-dm text-sm">
            We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
          </p>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer" 
            className="btn btn-primary w-full h-10 rounded-full flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            <span>Open Gmail</span>
          </a>
        </div>
      </AuthLayout>
      </>
    )
  }
  return (
    <AuthLayout
      title="Reset Password 🔐"
      subtitle="Enter your email to receive a password reset link"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your registered email"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-primary w-full h-10 rounded-full mt-4">
          Send Reset Link
        </button>

        <div className="f items-center text-sub font-dm text-sm center my-6 gap-3">
          <p>Remember your password?</p>
          <Link
            to="/login"
            className="btn-secondary items-center flex px-4 py-2 rounded-full"
          >
            <span>Back to Login</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Reset;
