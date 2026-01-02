import { 
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  Utensils, 
  Camera,
  Music,
  Car
} from "lucide-react";

const amenities = [
  { icon: Sparkles, title: "Luxury Decor", description: "Stunning decorations tailored to your event theme" },
  { icon: Shield, title: "24/7 Security", description: "Professional security team for your peace of mind" },
  { icon: Clock, title: "Flexible Hours", description: "Customizable event timings to suit your schedule" },
  { icon: Users, title: "500 Capacity", description: "Spacious venue accommodating up to 500 guests" },
  { icon: Utensils, title: "Premium Catering", description: "Gourmet cuisine from award-winning chefs" },
  { icon: Camera, title: "Photography Suite", description: "Dedicated spaces for stunning photo sessions" },
  { icon: Music, title: "Sound System", description: "State-of-the-art audio and lighting equipment" },
  { icon: Car, title: "Valet Parking", description: "Complimentary valet service for all guests" },
];

export function AmenitiesSection() {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-elegant text-xl mb-2">Why Choose Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">World-Class</span> Amenities
          </h2>
          <p className="text-muted-foreground text-lg">
            Every detail has been carefully crafted to ensure your event is nothing short of perfection.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div 
              key={amenity.title}
              className="group p-6 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-gold transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <amenity.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{amenity.title}</h3>
              <p className="text-muted-foreground text-sm">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
