import { Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";

const NewPassword = () => {
  return (
    <AuthLayout
      title="New Password 🔒"
      subtitle="Create a strong password for your account"
    >
      <form className="flex flex-col gap-4">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          icon={<Lock size={18} />}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          icon={<Lock size={18} />}
        />

        <button className="btn btn-primary w-full h-10 rounded-full mt-4">
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
