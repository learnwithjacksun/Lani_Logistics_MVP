import { Mail, Lock, UserRoundPlus, RefreshCcw } from "lucide-react";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { login, loading, user, userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  useEffect(() => {
    if (user && userData) {
      const path =
        userData.role === "rider" ? "/rider-dashboard" : "/dashboard";
      navigate(path, { replace: true });
    }
  }, [user, userData, navigate]);

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    toast.promise(
      login(formData.email, formData.password, from),
      {
        loading: "Logging In...",
        success: "Login Successful",
        error: (error) => {
          if (error.includes("Invalid credentials")) {
            return "Invalid email or password";
          }
          return error.toString();
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthLayout
      title="Welcome Back 🎉"
      subtitle="Sign in to continue using our services..."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={<Lock size={18} />}
        
        />

        <div className="flex items-center justify-between">
          <div className="font-semibold capitalize text-primary_1 text-sm">
            forgotten password?
          </div>
          <Link
            to="/reset"
            className="btn-secondary items-center flex px-4 py-2 rounded-full"
          >
            <RefreshCcw size={18} />
            <span>Reset</span>
          </Link>
        </div>

        <button
          className="btn btn-primary w-full h-10 rounded-full mt-4"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center text-sub font-dm text-sm center my-6 gap-3">
          <p>Create new account?</p>
          <Link
            to="/register"
            className="btn-secondary items-center flex px-4 py-2 rounded-full"
          >
            <UserRoundPlus size={18} />
            <span>Register</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
