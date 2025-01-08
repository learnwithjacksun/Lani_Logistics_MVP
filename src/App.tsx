import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./screens/Loading";
import { Toaster } from "react-hot-toast";
import OrderDetails from "./screens/History/OrderDetails";
import ScrollToTop from "./components/Common/ScrollToTop";
import { ProtectedRoute } from "./components/Auth";
import InstallPWA from "./components/Common/InstallPWA";
import { AnimatePresence } from "framer-motion";

const Home = lazy(() => import("./screens/Home"));
const Login = lazy(() => import("./screens/Auth/Login"));
const Register = lazy(() => import("./screens/Auth/Register"));
const Reset = lazy(() => import("./screens/Auth/Reset"));
const NewPassword = lazy(() => import("./screens/Auth/NewPassword"));
const Dashboard = lazy(() => import("./screens/Dashboard/Dashboard"));
const Profile = lazy(() => import("./screens/Dashboard/Profile"));
const Dispatch = lazy(() => import("./screens/Dispatch/Dispatch"));
const History = lazy(() => import("./screens/History/History"));
const Notifications = lazy(
  () => import("./screens/Notifications/Notifications")
);
const RiderLocation = lazy(() => import("./screens/Auth/RiderLocation"));
const RiderDashboard = lazy(() => import("./screens/Dashboard/RiderDashboard"));
const AvailableOrders = lazy(() => import("./screens/Rider/AvailableOrders"));
const PendingOrders = lazy(() => import("./screens/Rider/PendingOrders"));
const ActiveOrders = lazy(() => import("./screens/Rider/ActiveOrders"));
const Overview = lazy(() => import("./screens/Admin/Overview"));
const Users = lazy(() => import("./screens/Admin/Users"));
const UserDetails = lazy(() => import("./screens/Admin/UserDetails"));
const ParcelOrders = lazy(() => import("./screens/Admin/ParcelOrders"));
const Food = lazy(() => import("./screens/Food/Food"));
const ParcelOrderDetails = lazy(
  () => import("./screens/Admin/ParcelOrderDetails")
);
const NotFound = lazy(() => import("./screens/NotFound"));

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="customer">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dispatch"
            element={
              <ProtectedRoute allowedRole="customer">
                <Dispatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/history/:orderId" element={<OrderDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/location" element={<RiderLocation />} />
          <Route
            path="/rider-dashboard"
            element={
              <ProtectedRoute allowedRole="rider">
                <RiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/available-orders"
            element={
              <ProtectedRoute allowedRole="rider">
                <AvailableOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-orders"
            element={
              <ProtectedRoute allowedRole="customer">
                <PendingOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/active-orders"
            element={
              <ProtectedRoute allowedRole="customer">
                <ActiveOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/admin">
            <Route index element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserDetails />} />
            <Route path="orders" element={<ParcelOrders />} />
            <Route path="orders/:orderId" element={<ParcelOrderDetails />} />
          </Route>
          <Route path="/food" element={<Food />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--background)",
            color: "var(--main)",
            border: "1px solid var(--line)",
          },
          success: {
            iconTheme: {
              primary: "var(--primary-1)",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
      <AnimatePresence>
        <InstallPWA />
      </AnimatePresence>
    </>
  );
};

export default App;
