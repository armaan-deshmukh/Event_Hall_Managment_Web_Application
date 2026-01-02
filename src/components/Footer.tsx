import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-gradient-gold font-display text-2xl font-bold mb-4">
              Grand Elegance
            </h3>
            <p className="text-muted-foreground mb-6">
              Where every celebration becomes an unforgettable masterpiece. Experience luxury, elegance, and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#packages" className="text-muted-foreground hover:text-primary transition-colors">
                  Event Packages
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-muted-foreground hover:text-primary transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Types */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Event Types</h4>
            <ul className="space-y-3">
              <li className="text-muted-foreground">Weddings</li>
              <li className="text-muted-foreground">Birthday Parties</li>
              <li className="text-muted-foreground">Corporate Events</li>
              <li className="text-muted-foreground">Receptions</li>
              <li className="text-muted-foreground">Social Gatherings</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Newasa Fhata Road, Newasa kh, Ahmednagar, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">+(91) 8999116365 </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@grandelegancehall.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">Mon - Sun: 9AM - 10PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Grand Elegance Hall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
