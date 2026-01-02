import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import { Home, Package, Users, Calendar } from "lucide-react";

const AdminPage = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <a href="/admin" className="flex items-center gap-2 font-semibold">
              <span className="text-xl font-display text-gradient-gold">Admin Panel</span>
            </a>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <NavLink to="/admin" end className={getNavLinkClass}>
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/admin/packages" className={getNavLinkClass}>
                <Package className="h-4 w-4" />
                Packages
              </NavLink>
              <NavLink to="/admin/users" className={getNavLinkClass}>
                <Users className="h-4 w-4" />
                Users
              </NavLink>
              <NavLink to="/admin/bookings" className={getNavLinkClass}>
                <Calendar className="h-4 w-4" />
                Bookings
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex flex-col">
        {/* TODO: Add mobile header here */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
