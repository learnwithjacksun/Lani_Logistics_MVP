import { useState, useEffect } from "react";
import { Search, Filter, Package } from "lucide-react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useOrder } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Common";
import { OrderStatus } from "../../types/dispatch";
import { STORAGE, storage } from "../../Backend/appwriteConfig";

type FilterStatus = OrderStatus | "all";

const ParcelOrders = () => {
  const { parcelOrders } = useOrder();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [filteredOrders, setFilteredOrders] = useState(parcelOrders || []);

  useEffect(() => {
    if (!parcelOrders) return;

    const filtered = parcelOrders.filter((order) => {
      const matchesSearch =
        order.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.senderrName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, parcelOrders]);

  const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
    "in-transit": { bg: "bg-blue-500/10", text: "text-blue-500" },
    delivered: { bg: "bg-green-500/10", text: "text-green-500" },
    cancelled: { bg: "bg-red-500/10", text: "text-red-500" },
  };

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img);
  };

  return (
    <DashboardLayout title="Parcel Orders">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by tracking ID, package name, or sender..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-1 text-xs rounded-lg flex items-center gap-2 whitespace-nowrap ${
                selectedStatus === "all"
                  ? "bg-primary_1 text-white"
                  : "bg-background_2 text-main"
              }`}
            >
              <Filter size={18} />
              All Orders
            </button>
            {(
              [
                "pending",
                "in-transit",
                "delivered",
                "cancelled",
              ] as OrderStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 text-xs rounded-lg whitespace-nowrap ${
                  selectedStatus === status
                    ? `${statusColors[status].bg} ${statusColors[status].text}`
                    : "bg-background_2 text-main"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.$id}
              onClick={() => navigate(`/admin/orders/${order.trackingId}`)}
              className="bg-background border border-line rounded-xl p-4 hover:border-primary_1 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 overflow-hidden rounded-lg bg-background_2 flex items-center justify-center shrink-0">
                  {order.packageImage ? (
                    <img
                      src={imgUrl(order.packageImage)}
                      alt={order.packageName}
                      className="w-full object-cover"
                    />
                  ) : (
                    <Package size={24} className="text-sub" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-main">
                        {order.packageName}
                      </h3>
                      <p className="text-sm text-sub mt-1">
                        Sender: {order.senderName}
                      </p>
                      <p className="text-xs text-sub">ID: {order.trackingId}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusColors[order.status as OrderStatus].bg
                        } ${statusColors[order.status as OrderStatus].text}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <p className="text-xs text-sub mt-2">
                        {new Date(order.$createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background_2 mb-4">
                <Package size={32} className="text-sub" />
              </div>
              <h3 className="text-lg font-medium text-main">No orders found</h3>
              <p className="text-sub">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParcelOrders;
