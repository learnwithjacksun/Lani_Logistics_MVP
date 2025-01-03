import { useState } from "react";
import {
  Package,
  Timer,
  CheckCircle2,
  DollarSign,
  MapPin,
  Navigation,
  Phone,
  AlertCircle,
  Info,
} from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { getGreeting } from "../../utils/helpers";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../components/Common";
import toast from "react-hot-toast";
import { useAuth, useOrder, useNotifications } from "../../hooks";
import { Models } from "appwrite";

const RiderDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { allOrders, orders, completeOrder, isLoading } = useOrder();
  const firstName = userData?.name?.split(" ")[0];
  const [isOnline, setIsOnline] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState<Models.Document>();
  const [earnings] = useState({
    today: 4500,
    week: 28000,
    deliveries: 12,
  });
  const { notifications } = useNotifications();

  const handleStatusToggle = () => {
    setIsOnline(!isOnline);
  };

  const activeDeliveries = orders?.filter(
    (order) => order.status === "in-transit"
  );

  const openCompleteModal = async (order: Models.Document) => {
    setActiveDelivery(order);
    setShowCompleteModal(true);
  };
  const handleCompleteDelivery = (id: string) => {
    toast.promise(completeOrder(id), {
      loading: "Completing delivery...",
      success: "Delivery completed successfully",
      error: (error) => error.message,
    });
    setShowCompleteModal(false);
  };

  const handleViewOrders = () => {
    navigate("/available-orders");
  };
  const viewHistory = () => {
    navigate("/history");
  };

  const recentActivities = notifications?.slice(0, 3)?.map((notif) => ({
    icon:
      notif.type === "success"
        ? CheckCircle2
        : notif.type === "order"
        ? Package
        : notif.type === "system"
        ? Info
        : notif.type === "alert"
        ? AlertCircle
        : notif.type === "food"
        ? Package
        : Timer,
    color:
      notif.type === "success"
        ? "text-green-500"
        : notif.type === "order"
        ? "text-primary_1"
        : notif.type === "system"
        ? "text-blue-500"
        : notif.type === "alert"
        ? "text-red-500"
        : notif.type === "food"
        ? "text-primary_1"
        : "text-yellow-500",
    bg:
      notif.type === "success"
        ? "bg-green-500/10"
        : notif.type === "order"
        ? "bg-orange-500/10"
        : notif.type === "system"
        ? "bg-blue-500/10"
        : notif.type === "alert"
        ? "bg-red-500/10"
        : notif.type === "food"
        ? "bg-orange-500/10"
        : "bg-yellow-500/10",
    text: notif.title,
    time: new Date(notif.$createdAt).toLocaleString(),
  }));

  return (
    <DashboardLayout title={`${getGreeting()}, ${firstName} 👋`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Online Status Toggle */}
        <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium text-main">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isOnline
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              }`}
            >
              Go {isOnline ? "Offline" : "Online"}
            </button>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign size={18} className="text-green-500" />
              </div>
              <span className="text-sm text-sub">Today's Earnings</span>
            </div>
            <p className="text-xl font-semibold text-main">
              ₦{earnings.today.toLocaleString()}
            </p>
          </div>

          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <DollarSign size={18} className="text-primary_1" />
              </div>
              <span className="text-sm text-sub">This Week</span>
            </div>
            <p className="text-xl font-semibold text-main">
              ₦{earnings.week.toLocaleString()}
            </p>
          </div>

          <div
            onClick={viewHistory}
            className="bg-background border border-line rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package size={18} className="text-blue-500" />
              </div>
              <span className="text-sm text-sub">Deliveries</span>
            </div>
            <p className="text-xl font-semibold text-main">
              {earnings.deliveries}
            </p>
          </div>

          <div
            onClick={handleViewOrders}
            className="bg-background border border-line rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Package size={18} className="text-yellow-500" />
              </div>
              <span className="text-sm text-sub">Available Orders</span>
            </div>
            <p className="text-xl font-semibold text-main">
              {allOrders.length}
            </p>
          </div>
        </div>

        {/* Active Delivery */}
        <div className="rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-main">Active Delivery</h2>
          </div>
          <div className="py-4 space-y-4">
            {activeDeliveries.length === 0 ? (
              <div className="text-center py-8 text-sub">
                <Package size={40} className="mx-auto mb-3 text-sub/50" />
                <p>No active deliveries at the moment</p>
              </div>
            ) : (
              activeDeliveries.map((activeDelivery) => (
                <div className="space-y-3 border border-line bg-background p-4 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-orange-500/10">
                      <Navigation size={24} className="text-primary_1" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-main">
                        {activeDelivery?.packageName}
                      </h3>
                      <p className="text-sm text-sub">
                        ID: TRK{activeDelivery?.trackingId}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-500">
                      In Transit
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-primary_1 mt-1" />
                      <div>
                        <p className="text-sm text-sub">Pickup</p>
                        <p className="text-main">
                          {activeDelivery.pickupAddress}
                        </p>
                        <p className="text-xs text-sub mt-1">
                          Landmark:{" "}
                          {activeDelivery.pickupLandmark || "Not Provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-primary_2 mt-1" />
                      <div>
                        <p className="text-sm text-sub">Delivery</p>
                        <p className="text-main">
                          {activeDelivery.deliveryAddress}
                        </p>
                        <p className="text-xs text-sub mt-1">
                          Landmark:{" "}
                          {activeDelivery.deliveryLandmark || "Not Provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href={`tel:${activeDelivery.senderPhone}`}
                        className="btn flex-1 bg-green-500/10 text-green-500 h-10 rounded-full px-4"
                      >
                        <Phone size={18} />
                        <span className="text-sm">Sender</span>
                      </a>
                      <a
                        href={`tel:${activeDelivery.receiverPhone}`}
                        className="btn flex-1 bg-orange-500/10 text-primary_1 h-10 rounded-full px-4"
                      >
                        <Phone size={18} />
                        <span className="text-sm">Receiver</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => openCompleteModal(activeDelivery)}
                      className="flex-1 btn btn-primary py-3 rounded-xl"
                    >
                      Complete Delivery
                    </button>
                    <Link
                      to={`/delivery/${activeDelivery.id}/map`}
                      className="px-4 py-3 border text-sm text-main border-line rounded-xl bg-background_2"
                    >
                      View Map
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complete Delivery Modal */}
        <Modal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title="Complete Delivery"
        >
          <div className="space-y-4">
            <div className="p-4 bg-background_2 rounded-xl space-y-2">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-primary_1" />
                <div>
                  <h3 className="font-medium text-main">
                    {activeDelivery?.packageName}
                  </h3>
                  <p className="text-sm text-sub">
                    ID: {activeDelivery?.trackingId}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-main">Delivery Checklist</h4>
              <div className="space-y-3">
                {[
                  "Package has been handed over to the recipient",
                  "Recipient has confirmed the package condition",
                  "Delivery location matches the address",
                ].map((item, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 border border-line rounded-lg cursor-pointer hover:border-primary_1"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-primary_2"
                      required
                    />
                    <span className="text-sm text-main">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-3 border border-line rounded-xl
                  hover:bg-background_2 transition-colors text-main"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  activeDelivery?.$id &&
                  handleCompleteDelivery(activeDelivery.$id)
                }
                disabled={isLoading || !activeDelivery?.$id}
                className="flex-1 btn btn-primary py-3 rounded-xl disabled:opacity-50"
              >
                {isLoading ? "Completing..." : "Complete Delivery"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Recent Activity */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <h2 className="font-semibold text-main">Recent Activity</h2>
            <button className="text-sm text-primary_1">View All</button>
          </div>
          <div className="divide-y divide-line">
            {recentActivities?.length === 0 ? (
              <div className="p-4 text-center text-sub">No recent activity</div>
            ) : (
              recentActivities?.map((activity, index) => (
                <div key={index} className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activity.bg}`}>
                    <activity.icon size={18} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-main">{activity.text}</p>
                    <p className="text-xs text-sub">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Orders Section */}
        {/* <div className="bg-background border border-line rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Package size={18} className="text-yellow-500" />
              </div>
              <div>
                <h3 className="font-medium text-main">Available Orders</h3>
                <p className="text-sm text-sub">
                  {allOrders.length} new orders
                </p>
              </div>
            </div>
            <Link
              to="/available-orders"
              className="px-4 py-2 rounded-lg text-sm font-medium
                bg-primary_1/10 text-primary_1 hover:bg-primary_1/20
                transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default RiderDashboard;
