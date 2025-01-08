import { Mail, Phone, ShieldCheck } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useState } from "react";
import { Modal, Input } from "../../components/Common";
import { useAuth } from "../../hooks";
import toast from "react-hot-toast";
import { databases, DB, USERS } from "../../Backend/appwriteConfig";
import { Link } from "react-router-dom";

const Profile = () => {
  const { userData, user, logout, loading } = useAuth();
  const fullName = userData?.name;
  const email = userData?.email;
  const phone = userData?.phone;
  const isAdmin = user?.labels?.includes("admin");

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Validate phone (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(newPhone)) {
      toast.error("Please enter a valid Nigerian phone number");
      setIsUpdating(false);
      return;
    }

    if (!userData?.$id) return;

    try {
      await databases.updateDocument(DB, USERS, userData?.$id, {
        phone: newPhone,
      });
      toast.success("Phone number updated successfully");
      setShowPhoneModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update phone number");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-background border border-line rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-background_2 overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${fullName}&background=random`}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-main">{fullName}</h2>
                
              <p className="text-sub text-sm capitalize">{userData?.role}</p>
              {isAdmin && (
                  <span className="px-2 py-1 pr-4 bg-orange-500/10 text-primary_1 text-sm font-medium rounded-full inline-flex items-center gap-1">
                    <ShieldCheck size={16} />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-semibold text-main">Contact Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-primary_1 mt-1" />
              <div>
                <p className="text-sub text-sm">Email Address</p>
                <p className="text-main">{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-primary_1 mt-1" />
              <div className="flex-1">
                <p className="text-sub text-sm">Phone Number</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-main">{phone}</p>
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="text-xs text-primary_1 hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-semibold text-main">Account Actions</h3>
          </div>
          <div className="p-4">
            {isAdmin && (
              <Link to="/admin" className="btn-secondary py-2 rounded-lg mb-2">
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                toast.promise(logout(), {
                  loading: "Logging out...",
                  success: "Logged out successfully!",
                  error: "Failed to logout",
                });
              }}
              disabled={loading}
              className="w-full p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              {loading ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Phone Update Modal */}
      <Modal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title="Change Phone Number"
      >
        <form onSubmit={handlePhoneUpdate} className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-background_2 rounded-xl">
              <p className="text-sm text-sub">Current Phone Number</p>
              <p className="text-main font-medium mt-1">{phone}</p>
            </div>

            <Input
              label="New Phone Number"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Enter new phone number"
              icon={<Phone size={18} />}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowPhoneModal(false)}
              className="px-4 py-2 border text-main border-line rounded-lg hover:bg-background_2"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-primary_1 text-white rounded-lg hover:bg-primary_1/90 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Phone"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Profile;
