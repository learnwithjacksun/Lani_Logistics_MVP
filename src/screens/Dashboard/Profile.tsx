import { Mail, Phone, Edit2, Camera } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useState } from 'react';
import { Modal, Input } from "../../components/Common";
import { useAuth } from "../../hooks";
import toast from "react-hot-toast";
import { databases, DB, STORAGE, storage, USERS } from "../../Backend/appwriteConfig";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const { userData, logout, loading } = useAuth();
    const fullName = userData?.name;
    const email = userData?.email;
    const phone = userData?.phone;

    const navigate = useNavigate()
   
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Validate phone (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(newPhone)) {
      toast.error('Please enter a valid Nigerian phone number');
      setIsUpdating(false);
      return;
    }

    if(!userData?.$id) return;

    try {
      await databases.updateDocument(
        DB,
        USERS,
        userData?.$id,
        { phone: newPhone }
      );
      toast.success('Phone number updated successfully');
      setShowPhoneModal(false);
    } catch (error) {
        console.log(error);
      toast.error('Failed to update phone number');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    toast.promise(logout(), {
      loading: "Logging out...",
      success: ()=>{
        navigate("/login")
        return "Logged out successfully"
      },
      error: (error) => {
        console.log(error);
        return "Logout failed";
      },
    });
  }

  return (
    <DashboardLayout title="Profile">
      {/* Profile Header */}
      <div className="bg-background border border-line rounded-xl p-6 text-center relative mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden">
            <img
              src={storage.getFilePreview(STORAGE, userData?.avatar)}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${fullName}&background=random`;
              }}
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-background border border-line rounded-full text-main hover:text-primary_1">
            <Camera size={16} />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-main mt-4">{fullName}</h2>
      </div>

      {/* User Information */}
      <div className="bg-background border border-line rounded-xl overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <h3 className="font-semibold text-main">Personal Information</h3>
          <button className="p-2 hover:bg-background_2 rounded-full text-sub hover:text-main">
            <Edit2 size={18} />
          </button>
        </div>
        
        <div className="divide-y divide-line">
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary_1/10">
              <Mail size={18} className="text-primary_1" />
            </div>
            <div>
              <p className="text-xs text-sub">Email</p>
              <p className="text-sm text-main">{email}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary_1/10">
              <Phone size={18} className="text-primary_1" />
            </div>
            <div>
              <p className="text-xs text-sub">Phone</p>
              <p className="text-sm text-main">{phone}</p>
            </div>
          </div>

          {/* <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary_1/10">
              <MapPin size={18} className="text-primary_1" />
            </div>
            <div>
              <p className="text-xs text-sub">Address</p>
              <p className="text-sm text-main">{userInfo.address}</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-8 space-y-4">
        <button 
          onClick={() => setShowPhoneModal(true)}
          className="w-full p-4 border border-line rounded-xl text-left hover:border-primary_1 text-main bg-background"
        >
          Change Phone Number
        </button>
        <button 
          onClick={handleLogout} 
          disabled={loading} 
          className="w-full p-4 border border-red-500 rounded-xl text-left hover:border-red-500 text-red-500 bg-red-500/10"
        >
          {loading ? "Logging out..." : "Log Out"}
        </button>
      </div>

      {/* Phone Change Modal */}
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
              {isUpdating ? 'Updating...' : 'Update Phone'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Profile;
