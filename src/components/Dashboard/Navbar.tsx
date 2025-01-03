import { Home, Package, History, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const {userData} = useAuth()
  const userType = userData?.role;

  const getHomeRoute = () => {
    return userType === 'rider' ? '/rider-dashboard' : '/dashboard';
  };

  const links = [
    {
      name: "Home",
      icon: Home,
      to: getHomeRoute(),
    },
    {
      name: userType === 'rider' ? "Available Orders" : "Request Dispatch",
      icon: Package,
      to: userType === 'rider' ? "/available-orders" : "/pending-orders",
    },
    {
      name: "History",
      icon: History,
      to: "/history",
    },
    {
      name: "Profile",
      icon: User,
      to: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4">
      <nav className="bg-background/70 backdrop-blur-lg border border-line rounded-2xl px-4 py-3 shadow-lg shadow-black/5">
        <ul className="flex items-center gap-3">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink 
                to={link.to}
                className={`
                  p-3 rounded-xl flex items-center justify-center
                  transition-all duration-300 relative
                  ${location.pathname === link.to 
                    ? "text-primary_1 bg-primary_1/10 scale-110" 
                    : "text-sub hover:text-main hover:bg-background_2"
                  }
                  ${location.pathname === link.to 
                    ? "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary_1" 
                    : ""
                  }
                `}
              >
                <link.icon 
                  size={20} 
                  className={`transition-transform ${
                    location.pathname === link.to 
                      ? "transform rotate-[360deg] duration-500" 
                      : ""
                  }`}
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
