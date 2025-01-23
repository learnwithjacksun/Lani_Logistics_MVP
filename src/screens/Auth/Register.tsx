import { Mail, Lock, LogIn, User, Phone, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../Layouts/AuthLayout";
import Input from "../../components/Common/Input";
import { useState } from "react";
import { useAuth } from "../../hooks";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'rider';
}

const Register = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Validate phone (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid Nigerian phone number');
      return;
    }

    // Validate password
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    toast.promise(

      register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.role
      ),
      {
        loading: "Creating Account...",
        success: "Account Created Successfully!",
        error: (err)=>{
          return err
        }
      }
    )

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AuthLayout
      title="Create Account 🚀"
      subtitle="Sign up to start tracking your shipments..."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <label 
            className={`flex-1 border rounded-lg p-4 flex items-center gap-3 cursor-pointer
              ${formData.role === 'customer' ? 'border-primary_1' : 'border-line hover:border-primary_1'}`}
          >
            <input
              type="radio"
              name="role"
              value="customer"
              checked={formData.role === 'customer'}
              onChange={handleChange}
              className="hidden"
            />
            <CheckCircle2 
              size={20} 
              className={formData.role === 'customer' ? 'text-primary_1' : 'text-sub'} 
            />
            <div className="text-left">
              <h3 className="font-semibold text-main">Customer</h3>
              <p className="text-xs text-sub">Send packages</p>
            </div>
          </label>

          <label 
            className={`flex-1 border rounded-lg p-4 flex items-center gap-3 cursor-pointer
              ${formData.role === 'rider' ? 'border-primary_1' : 'border-line hover:border-primary_1'}`}
          >
            <input
              type="radio"
              name="role"
              value="rider"
              checked={formData.role === 'rider'}
              onChange={handleChange}
              className="hidden"
            />
            <CheckCircle2 
              size={20} 
              className={formData.role === 'rider' ? 'text-primary_1' : 'text-sub'} 
            />
            <div className="text-left">
              <h3 className="font-semibold text-main">Rider</h3>
              <p className="text-xs text-sub">Deliver packages</p>
            </div>
          </label>
        </div>

        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          icon={<User size={18} />}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          icon={<Phone size={18} />}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          icon={<Lock size={18} />}
          required
        />

        <button 
          className="btn btn-primary w-full h-10 rounded-full mt-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="flex items-center text-sub font-dm text-sm center my-6 gap-3">
          <p>Already have an account?</p>
          <Link
            to="/login"
            className="btn-secondary items-center flex px-4 py-2 rounded-full"
          >
            <LogIn size={18} />
            <span>Login</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
 