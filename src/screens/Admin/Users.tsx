import { useState, useEffect } from 'react';
import { Search, Filter, User } from 'lucide-react';
import DashboardLayout from "../../Layouts/DashboardLayout";
import { useAuth } from "../../hooks";
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Common';

type UserRole = 'all' | 'customer' | 'rider';

const Users = () => {
  const { users } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('all');
  const [filteredUsers, setFilteredUsers] = useState(users || []);

  useEffect(() => {
    if (!users) return;

    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  return (
    <DashboardLayout title="Users Management">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedRole === 'all' 
                  ? 'bg-primary_1 text-white' 
                  : 'bg-background_2 text-main'
              }`}
            >
              <Filter size={18} />
              All
            </button>
            <button
              onClick={() => setSelectedRole('customer')}
              className={`px-4 py-2 rounded-lg ${
                selectedRole === 'customer' 
                  ? 'bg-primary_1 text-white' 
                  : 'bg-background_2 text-main'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setSelectedRole('rider')}
              className={`px-4 py-2 rounded-lg ${
                selectedRole === 'rider' 
                  ? 'bg-primary_1 text-white' 
                  : 'bg-background_2 text-main'
              }`}
            >
              Riders
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4 md:grid-cols-2 ">
          {filteredUsers.map((user) => (
            <div
              key={user.$id}
              onClick={() => navigate(`/admin/users/${user.$id}`)}
              className="bg-background border border-line rounded-xl p-4 hover:border-primary_1 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-background_2 overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-main">{user.name}</h3>
                  <p className="text-sm text-sub">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'rider' 
                        ? 'bg-orange-500/10 text-orange-500' 
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {user.role}
                    </span>
                    {user.city && (
                      <span className="text-xs text-sub">
                        📍 {user.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background_2 mb-4">
              <User size={32} className="text-sub" />
            </div>
            <h3 className="text-lg font-medium text-main">No users found</h3>
            <p className="text-sub">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;