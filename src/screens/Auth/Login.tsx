import { Mail, Lock, UserRoundPlus, RefreshCcw, Loader } from "lucide-react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Input, Modal } from "../../components/Common";
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
  const [showSessionModal, setShowSessionModal] = useState(false);
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (userData && user ) {
      if (userData?.role === "rider") {
        navigate("/rider-dashboard");
        setShowSessionModal(true);
      } else {
        navigate(from, { replace: true });
        setShowSessionModal(true);
      }
    }
  }, [from, navigate, user, userData, userData?.role]);


  const handleRedirectToDashboard = () => {
    const path = userData?.role === "rider" ? "/rider-dashboard" : "/dashboard";
    navigate(path, { replace: true });
  };

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

    toast.promise(login(formData.email, formData.password, from), {
      loading: "Logging In...",
      success: "Login Successful",
      error: (error) => {
        if (error.includes("Invalid credentials")) {
          return "Invalid email or password";
        }
        return error.toString();
      },
    });
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
          placeholder="Minimum 8 characters"
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
          {loading ? <Loader size={18} className="animate-spin" /> : "Sign in"}
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
      {/* Session Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        title={`Hello, ${userData?.name?.split(" ")[0]}! 👋`}
      >
        <div className="px-4 space-y-10">
          <p className="text-main text-base">
            It seems you're already logged in as{" "}
            <span className="font-semibold text-primary_2">
              {userData?.email}
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRedirectToDashboard}
              className="flex-1 px-4 py-2 bg-primary_1 text-white rounded-lg hover:bg-primary_1/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default Login;
