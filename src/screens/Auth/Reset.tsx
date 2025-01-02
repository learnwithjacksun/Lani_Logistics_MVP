import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";

const Reset = () => {
  return (
    <AuthLayout
      title="Reset Password 🔐"
      subtitle="Enter your email to receive a password reset link"
    >
      <form className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your registered email"
          icon={<Mail size={18} />}
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
