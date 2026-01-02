import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PackageManagement from "./pages/admin/PackageManagement";
import UserManagement from "./pages/admin/UserManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import BookingPage from "./pages/Booking";
import MyBookingsPage from "./pages/MyBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminDashboard />} />
              <Route path="packages" element={<PackageManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
