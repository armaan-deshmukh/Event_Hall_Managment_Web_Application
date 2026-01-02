import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Star, Users, Clock } from "lucide-react";
import heroImage from "@/assets/hero-hall.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBooking = () => {
    if (!user) {
      navigate("/auth?redirect=/book");
    } else {
      navigate("/book");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Grand Elegance Hall"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-elegant text-xl md:text-2xl mb-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Welcome to
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <span className="text-gradient-gold">Grand Elegance</span>
            <br />
            <span className="text-foreground">Hall</span>
          </h1>
          <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Where every celebration becomes an unforgettable masterpiece. 
            Experience luxury, elegance, and exceptional service for your special moments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" onClick={handleBooking}>
              <Calendar className="h-5 w-5" />
              Book Your Event
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Packages
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-2">
                <Star className="h-5 w-5 fill-primary" />
                <span className="font-display text-3xl md:text-4xl font-bold">500+</span>
              </div>
              <p className="text-muted-foreground text-sm">Events Hosted</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-2">
                <Users className="h-5 w-5" />
                <span className="font-display text-3xl md:text-4xl font-bold">500</span>
              </div>
              <p className="text-muted-foreground text-sm">Guest Capacity</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-display text-3xl md:text-4xl font-bold">10+</span>
              </div>
              <p className="text-muted-foreground text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
