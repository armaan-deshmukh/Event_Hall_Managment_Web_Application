import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "./NavLink";

export function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBooking = () => {
    if (!user) {
      navigate("/auth?redirect=/book");
    } else {
      navigate("/book");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gradient-gold font-display text-2xl font-bold">
              Grand Elegance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Home
            </NavLink>
            <NavLink to="/#packages" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Packages
            </NavLink>
            <NavLink to="/#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              About
            </NavLink>
            <NavLink to="/#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Contact
            </NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-32 truncate">
                        {user.full_name || user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/my-bookings")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="hero" onClick={handleBooking}>
                  <Calendar className="h-4 w-4" />
                  Book Your Event
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => navigate("/auth?mode=register")}>
                  Register
                </Button>
                <Button variant="hero" onClick={handleBooking}>
                  <Calendar className="h-4 w-4" />
                  Book Your Event
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <NavLink 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/#packages" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Packages
              </NavLink>
              <NavLink 
                to="/#about" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink 
                to="/#contact" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 py-2 text-foreground">
                      <User className="h-4 w-4" />
                      <span>{user.full_name || user.email?.split('@')[0]}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => { navigate("/my-bookings"); setMobileMenuOpen(false); }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button variant="outline" onClick={() => { navigate("/auth?mode=register"); setMobileMenuOpen(false); }}>
                      Register
                    </Button>
                  </>
                )}
                <Button variant="hero" onClick={() => { handleBooking(); setMobileMenuOpen(false); }}>
                  <Calendar className="h-4 w-4" />
                  Book Your Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
