import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import RoleProtectedRoute from "./routes/RoleProtectedRoute.jsx";
import RedirectByRole from "./routes/RedirectByRole";

import MainLayout from "./components/layout/MainLayout.js";
import Home from "./pages/main/Home.jsx"; // Keep only this Home
import AddRestaurant from "./pages/main/AddRestaurant.jsx";

import AuthLayout from "./components/layout/AuthLayout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import UserProfile from "./pages/UserProfile.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";

import SystemAdminDashboardLayout from "./components/layout/SystemAdminDashboardLayout.js";
import RestaurantAdminDashboardLayout from "./components/layout/RestaurantAdminDashboardLayout.js";
import DeliveryPersonalDashboardLayout from "./components/layout/DeliveryPersonalDashboardLayout.js";

import RestaurantApproval from "./pages/Dashboard/RestaurantApproval.jsx";
import Customers from "./pages/Dashboard/Customers.jsx";
import AllCustomers from "./pages/Dashboard/AllCustomers.jsx";
import NewCustomers from "./pages/Dashboard/NewCustomers.jsx";
import VIPCustomers from "./pages/Dashboard/VIPCustomers.jsx";

import MenuManagement from "./pages/Dashboard/MenuManagement.jsx";

// import Profile from "./pages/main/Profile.jsx";

import SystemAdminPage from "./pages/systemAdminPage.jsx";
// import DeliveryPersonnelPage from "./pages/deliveryPersonnelPage.jsx";

import PageNotFound from "./pages/errors/PageNotFound.jsx";
import Unauthorized from "./pages/errors/Unauthorized.jsx";
import DeliveryDetails from "./pages/Dashboard/delivery-details.jsx";
import ReadyDeliveries from "./pages/Dashboard/delivery-order.jsx";
import MyDeliveries from "./pages/Dashboard/my-delivery.jsx";

import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentHistory from "./pages/PaymentHistory.jsx"; // Import PaymentHistory page
// import Sidebar from "./components/dashboard/Sidebar.jsx";

import Restaurants from "./components/Restaurants.jsx";
import RestaurantPage from "./components/RestaurantPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import DemPaymentPage from "./components/PaymentPage";
import ManageRestaurants from "./pages/Dashboard/ManageRestaurants.jsx";

import RestaurantAdminWrapper from "./components/RestaurantAdminWrapper.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth layout routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main layout routes */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "customer",
                    "system_admin",
                    "restaurant_admin",
                  ]}
                />
              }
            >
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/add-restaurent" element={<AddRestaurant />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/pay" element={<PaymentPage />} />
              <Route path="/track-order/:orderId" element={<TrackOrder />} />
              <Route path="/profile" element={<UserProfile />} />;
            </Route>
          </Route>

          <Route element={<SystemAdminDashboardLayout />}>
            <Route
              element={<RoleProtectedRoute allowedRoles={["system_admin"]} />}
            >
              <Route path="/system-admin" element={<SystemAdminPage />} />
              <Route
                path="/restaurant-approval"
                element={<RestaurantApproval />}
              />
              <Route
                path="/manage-restaurents"
                element={<ManageRestaurants />}
              />
              <Route path="/payment-history" element={<PaymentHistory />} />
            </Route>
          </Route>

          <Route element={<RestaurantAdminDashboardLayout />}>
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["restaurant_admin"]} />
              }
            >
              <Route path="/menu-management" element={<MenuManagement />} />
              <Route
                path="/restaurant-admin"
                element={<RestaurantAdminWrapper />}
              />
            </Route>
          </Route>

          <Route element={<DeliveryPersonalDashboardLayout />}>
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["delivery_personnel"]} />
              }
            >
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/all" element={<AllCustomers />} />
              <Route path="/customers/new" element={<NewCustomers />} />
              <Route path="/customers/vip" element={<VIPCustomers />} />
              <Route path="/ready-deliveries" element={<ReadyDeliveries />} />
              <Route path="/:deliveryId" element={<DeliveryDetails />} />
              <Route path="/deliveries" element={<MyDeliveries />} />
            </Route>
          </Route>

          {/* Role-based redirection */}
          <Route path="/dashboard" element={<RedirectByRole />} />

          {/* Catch all */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        {/* -----------------------------------------------*/}
      </Router>
    </AuthProvider>
  );
}

export default App;
