import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Package, Bike } from 'lucide-react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useAuth, useOrder } from "../../hooks";
import { Models } from 'appwrite';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users } = useAuth();
  const { parcelOrders } = useOrder();
  const [user, setUser] = useState<Models.Document | null>(null);
  const [userOrders, setUserOrders] = useState<Models.Document[]>([]);

  useEffect(() => {
    if (!users || !userId) return;
    const foundUser = users.find(u => u.$id === userId);
    if (foundUser) {
      setUser(foundUser);
      // Filter orders based on user role
      const orders = foundUser.role === 'rider' 
        ? parcelOrders.filter(order => order.riderId === userId)
        : parcelOrders.filter(order => order.customerId === userId);
      setUserOrders(orders);
    }
  }, [users, userId, parcelOrders]);

  console.log(userOrders);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-main">User not found</h2>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 px-4 py-2 bg-primary_1 text-white rounded-lg"
          >
            Back to Users
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Details">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Profile Card */}
        <div className="bg-background border border-line rounded-xl p-6">
          <div className="flex items-start md:flex-row flex-col gap-6">
            <div className="min-w-24 w-24 h-24 rounded-full bg-background_2 overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=96`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-main">{user.name}</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sub">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sub">
                  <Phone size={18} />
                  <span>{user.phone}</span>
                </div>
                {user.city && (
                  <div className="flex items-center gap-2 text-sub">
                    <MapPin size={18} />
                    <span>{user.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sub">
                  <Calendar size={18} />
                  <span>Joined {new Date(user.$createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.role === 'rider' 
                    ? 'bg-orange-500/10 text-orange-500' 
                    : 'bg-green-500/10 text-green-500'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Package size={20} className="text-primary_1" />
              </div>
              <div>
                <p className="text-sub text-sm">Total Orders</p>
                <p className="text-xl font-bold text-main">{userOrders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Package size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-sub text-sm">Completed</p>
                <p className="text-xl font-bold text-main">
                  {userOrders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          {user.role === 'rider' && (
            <>
              <div className="bg-background border border-line rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Bike size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sub text-sm">In Transit</p>
                    <p className="text-xl font-bold text-main">
                      {userOrders.filter(order => order.status === 'in-transit').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-line rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Package size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sub text-sm">Pending</p>
                    <p className="text-xl font-bold text-main">
                      {userOrders.filter(order => order.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-background border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-semibold text-main">Recent Orders</h3>
          </div>
          <div className="divide-y divide-line">
            {userOrders.length === 0 ? (
              <div className="p-4 text-center text-sub">
                No orders found
              </div>
            ) : (
              userOrders.slice(0, 5).map((order) => (
                <div 
                  key={order.$id}
                  className="p-4 hover:bg-background_2 cursor-pointer"
                  onClick={() => navigate(`/history/${order.trackingId}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-main">{order.packageName}</p>
                      <p className="text-sm text-sub">ID: {order.trackingId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' 
                        ? 'bg-green-500/10 text-green-500'
                        : order.status === 'in-transit'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails; 