import {
  CheckCircle,
  UtensilsCrossed,
  Bike,
  MapPin,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { getGreeting } from "../../utils/helpers";
import { useAuth } from "../../hooks";

const services = [
  {
    title: "Request Dispatch",
    description: "Send packages across the city",
    icon: Bike,
    path: "/dispatch",
    color: "text-primary_1",
  },
  {
    title: "Order Food",
    description: "Order from restaurants near you",
    icon: UtensilsCrossed,
    path: "/food",
    color: "text-primary_2",
  },
];

const quickStats = [
  {
    title: "Active Orders",
    value: "02",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Completed",
    value: "28",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

const Dashboard = () => {
    const { userData } = useAuth();
    console.log(userData);
    const firstName = userData?.name.split(" ")[0];
  return (
    <DashboardLayout title={`${getGreeting()}, ${firstName} 👋`}>
      {/* Service Cards */}
      <div className="grid gap-4 mb-8">
        {services.map((service, index) => (
          <Link
            key={index}
            to={service.path}
            className="p-4 border border-line rounded-xl hover:border-primary_1 transition-all duration-300 bg-background group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  service.color === "text-primary_1"
                    ? "bg-primary_1/10"
                    : "bg-primary_2/10"
                }`}
              >
                <service.icon size={24} className={service.color} />
              </div>
              <div>
                <h3 className="font-semibold text-main">{service.title}</h3>
                <p className="text-sub text-sm mt-1">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-line bg-background"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sub text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-main mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-background border border-line rounded-xl overflow-hidden">
        <div className="p-4 border-b border-line">
          <h2 className="font-semibold text-main">Recent Activity</h2>
        </div>
        <div className="divide-y divide-line">
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <MapPin size={18} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-main">
                Food Order #1234
              </h3>
              <p className="text-xs text-sub">Order is being prepared</p>
            </div>
            <span className="text-xs text-sub">2m ago</span>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Bike size={18} className="text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-main">Package #5678</h3>
              <p className="text-xs text-sub">Out for delivery</p>
            </div>
            <span className="text-xs text-sub">15m ago</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
