import {
  CheckCircle,
  UtensilsCrossed,
  Bike,
  Timer,
  Bell,
  Package,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { getGreeting } from "../../utils/helpers";
import { useAuth, useOrder, useNotifications } from "../../hooks";

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

const Dashboard = () => {
    const { userData } = useAuth();
    const { orders } = useOrder();
    const { notifications } = useNotifications();
    const firstName = userData?.name.split(" ")[0];

    const activeOrdersCount = orders.filter(order => order.status === "in-transit").length;
    const pendingOrdersCount = orders.filter(order => order.status === "pending").length;

    const quickStats = [
      {
        title: "Active Orders",
        value: activeOrdersCount.toString().padStart(2, '0'),
        icon: Timer,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        path: "/active-orders"
      },
      {
        title: "Pending Orders",
        value: pendingOrdersCount.toString().padStart(2, '0'),
        icon: CheckCircle,
        color: "text-green-500",
        bg: "bg-green-500/10",
        path: "/pending-orders"
      },
    ];

    const recentActivities = notifications?.slice(0, 3)?.map(notif => ({
      icon: notif.type === 'success' ? CheckCircle2 : 
            notif.type === 'order' ? Package : 
            notif.type === 'system' ? Info : Bell,
      color: notif.type === 'success' ? 'text-green-500' :
             notif.type === 'order' ? 'text-primary_1' : 
             notif.type === 'system' ? 'text-blue-500' : 'text-yellow-500',
      bg: notif.type === 'success' ? 'bg-green-500/10' :
          notif.type === 'order' ? 'bg-primary_1/10' : 
          notif.type === 'system' ? 'bg-blue-500/10' : 'bg-yellow-500/10',
      title: notif.title,
      time: new Date(notif.$createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    }));

 

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
          <Link
            key={index}
            to={stat.path}
            className="p-4 rounded-xl border border-line bg-background hover:border-primary_1 transition-all"
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
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-background border border-line rounded-xl overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <h2 className="font-semibold text-main">Recent Activity</h2>
          <Link to="/notifications" className="text-sm text-primary_1">
            View All
          </Link>
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
                  <p className="text-sm text-main">{activity.title}</p>
                  <p className="text-xs text-sub">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
