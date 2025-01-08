import { Link } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import {
  ArrowRight,
  Bike,
  DollarSign,
  Package,
  UserCheck2,
  Utensils,
} from "lucide-react";
import { getGreeting } from "../../utils/helpers";
import useOrder from "../../hooks/useOrder";

const Overview = () => {
  const { users, userData } = useAuth();
  const { parcelOrders, parcelRevenue } = useOrder();

  const foodRevenue = 0;
  const foodOrders = [];
  const riders = [];

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(number);
  };

  const overview = [
    {
      to: "/admin/users",
      icon: <UserCheck2 />,
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      title: "Total Users",
      count: users.length,
    },
    {
      to: "/admin/orders",
      icon: <Package />,
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      title: "Total Parcel Orders",
      count: parcelOrders.length,
    },
    {
      to: "/admin/something-else",
      icon: <Utensils />,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      title: "Total Food Orders",
      count: foodOrders.length,
    },
    {
      to: "/admin/riders",
      icon: <Bike />,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      title: "Something Else",
      count: riders.length,
    },
  ];

  return (
    <>
      <DashboardLayout
        title={`${getGreeting()}, ${userData?.name?.split(" ")[0]} 😎`}
      >
        <div className="bg-background p-6 rounded-xl border border-line">
          <div className="flex md:items-center justify-between md:flex-row flex-col mb-6 line pb-5">
            <div className="flex md:items-center gap-2 w-full">
              <div className="flex items-center justify-center h-12 min-w-12 w-12 bg-purple-500/10 rounded-full text-purple-500">
                <DollarSign size={24} />
              </div>
              <div className="w-full flex md:items-center md:justify-between md:flex-row flex-col gap-2">
                  <div className="flex-1">
                    <h3 className="text-main font-medium">Total Revenue</h3>
                    <p className="text-sub text-sm">All time earnings</p>
                  </div>
                  <div className=" md:mt-0">
                    <p className="text-main font-bold text-2xl">
                      {formatNumber(parcelRevenue + foodRevenue)}
                    </p>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center  gap-3">
                <Package className="text-orange-500" size={20} />
                <span className="text-sub">Parcel Delivery</span>
              </div>
              <p className="text-main font-medium">
                {formatNumber(parcelRevenue)}
              </p>
            </div>

            <div className="flex items-center justify-between ">
              <div className="flex items-center text-blue-500 gap-3">
                <Utensils className="text-green-500" size={20} />
                <span className="text-sub">Food Orders</span>
              </div>
              <p className="text-main font-medium">
                {formatNumber(foodRevenue)}
              </p>
            </div>
          </div>

          <a
            href="paystack.com"
            className="text-main flex items-center gap-2 btn-primary mt-4 rounded-md h-10"
          >
            <span>Go to Paystack</span> <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {overview.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-background p-4 rounded-xl border border-line"
            >
              <div
                className={`flex items-center mb-4 justify-center h-10 w-10 ${item.bgColor} rounded-md ${item.textColor}`}
              >
                {item.icon}
              </div>
              <h3 className="text-sub text-base">{item.title}</h3>
              <p className="text-main font-medium text-2xl mt-1">
                {item.count}
              </p>
            </Link>
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Overview;
