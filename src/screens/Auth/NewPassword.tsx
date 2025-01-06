import { Lock, ArrowRight } from "lucide-react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";
import { useAuth } from "../../hooks";
import { useState } from "react";
import toast from "react-hot-toast";

const NewPassword = () => {
  const { newPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 
   if (!userId || !secret) {
    return <Navigate to="/reset" />;
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Password and confirm password are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    toast.promise(newPassword(password, userId, secret), {
      loading: "Updating password...",
      success: "Password updated",
      error: ({error}) => error.message,
    });
  }
  return (
    <AuthLayout
      title="New Password 🔒"
      subtitle="Create a strong password for your account"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          icon={<Lock size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn btn-primary w-full h-10 rounded-full mt-4" type="submit">
          Reset Password
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

export default NewPassword;
