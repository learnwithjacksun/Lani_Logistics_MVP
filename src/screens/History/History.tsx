import { useState } from 'react';
import { Search, Filter, Package, X } from 'lucide-react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { OrderStatus } from '../../types/dispatch';
import { useNavigate } from 'react-router-dom';
// import { mockOrders } from '../../data/mockOrders';
import { motion, AnimatePresence } from 'framer-motion';
import useOrder from '../../hooks/useOrder';
import { storage, STORAGE } from '../../Backend/appwriteConfig';

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  'in-transit': { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  'delivered': { bg: 'bg-green-500/10', text: 'text-green-500' },
  'cancelled': { bg: 'bg-red-500/10', text: 'text-red-500' }
};

const History = () => {
const {orders} = useOrder()
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
 
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const imgUrl = (img: string) => {
    return storage.getFilePreview(STORAGE, img)
  }

  return (
    <DashboardLayout title="Order History">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" />
            <input
              type="text"
              placeholder="Search by ID, package name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-line
                focus:border-primary_1 bg-background text-main text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`p-3 rounded-xl border ${
              statusFilter !== 'all' 
                ? 'border-primary_1 bg-primary_1/5 text-primary_1' 
                : 'border-line text-sub hover:border-primary_1'
            } transition-all`}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filter Modal */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                style={{ marginTop: 0 }}
              />

              {/* Modal */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  y: "100%" 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  y: "100%" 
                }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 400 
                }}
                className="fixed bottom-0 left-0 right-0 
                   md:left-1/2 md:top-1/2 
                  md:-translate-x-1/2 md:-translate-y-1/2 
                  w-full md:max-w-lg bg-secondary 
                  rounded-t-[32px] md:rounded-2xl 
                  p-6 z-50"
              >
                {/* Small visual indicator for mobile */}
                <div className="w-12 h-1 bg-line rounded-full mx-auto mb-6 md:hidden" />

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-main">Filter Orders</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-background_2 rounded-full text-sub"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-sub">Status</p>
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                  >
                    {[
                      { value: 'all', label: 'All Orders' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'in-transit', label: 'In Transit' },
                      { value: 'delivered', label: 'Delivered' },
                      { value: 'cancelled', label: 'Cancelled' }
                    ].map((status) => (
                      <motion.button
                        key={status.value}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        onClick={() => {
                          setStatusFilter(status.value as OrderStatus | 'all');
                          setIsFilterOpen(false);
                        }}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          statusFilter === status.value
                            ? 'border-primary_1 bg-orange-500/10 text-primary_1'
                            : 'border-line text-sub bg-background_2 hover:border-primary_1'
                        }`}
                      >
                        {status.label}
                      </motion.button>
                    ))}
                  </motion.div>

                  {statusFilter !== 'all' && (
                    <motion.div 
                      className="pt-4 flex justify-end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setIsFilterOpen(false);
                        }}
                        className="text-sm text-sub hover:text-primary_1"
                      >
                        Clear Filter
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {statusFilter !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-sub">Filtered by:</span>
            <span className={`px-3 py-1 text-sm rounded-full ${
              statusColors[statusFilter as OrderStatus].bg
            } ${statusColors[statusFilter as OrderStatus].text}`}>
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-sub">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/history/${order?.$id}`)}
                className="bg-background border border-line rounded-xl p-4 space-y-4 cursor-pointer hover:border-primary_1 transition-all"
              >
                <div className="flex gap-4">
                  {/* Package Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-background_2 shrink-0">
                    {order?.packageImage ? (
                      <img 
                        src={imgUrl(order?.packageImage)} 
                        alt={order.packageName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-sub" />
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-main truncate">{order?.packageName}</h3>
                        <p className="text-xs text-sub">ID: {order?.trackingId}</p>
                      </div>
                      <span className={`shrink-0 px-3 py-1 rounded-full text-sm ${
                        statusColors[order.status as OrderStatus].bg} ${statusColors[order.status as OrderStatus].text
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-sub truncate">
                      {order?.pickupAddress} → {order?.deliveryAddress}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History; 