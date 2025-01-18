import { ArrowLeft, User, Settings, LogOut, Bell } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../Common/ThemeToggle";
import { useAuth, useNotifications } from "../../hooks";
import { toast } from "react-hot-toast";


const Header = () => {
  const { userData, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
   toast.promise(logout(), {
    loading: "Logging out...",
    success: "Logged out successfully!",
      error: ({error}) => error.message,
    });
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="layout py-4 flex justify-between items-center">
        {pathname === '/dashboard' || pathname === '/rider-dashboard' ? (
          <img src="/logo-orange.png" alt="Lani" className="w-10 h-10" />
        ) : (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-background hover:bg-background_2 rounded-full"
          >
            <ArrowLeft size={20} className="text-main" />
          </button>
        )}

        <div className="flex items-center gap-3">
            
          <Link 
            to="/notifications" 
            className="p-2 hover:bg-background_2 rounded-full relative"
          >
            <Bell size={20} className="text-main" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary_1 rounded-full" />}
          </Link>
          
          <ThemeToggle />
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 rounded-full bg-background_2 border border-line overflow-hidden hover:border-primary_1 transition-colors"
            >
              <img
                src="/default-avatar.png"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${userData?.name}&background=random`;
                }}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg border border-line shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-line">
                  <p className="text-main font-semibold">{userData?.name}</p>
                  <p className="text-sub text-xs">{userData?.email}</p>
                </div>
                
                <Link 
                  to="/profile"
                  className="w-full px-4 py-2 text-sm hover:bg-background_2 flex items-center gap-2 text-main"
                >
                  <User size={16} />
                  Profile
                </Link>
                
                <Link 
                  to="/settings"
                  className="w-full px-4 py-2 text-sm hover:bg-background_2 flex items-center gap-2 text-main"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                
                <div className="border-t border-line my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-background_2 flex items-center gap-2 text-red-500"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;