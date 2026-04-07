import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Users, Clock } from "lucide-react";
import weddingImage from "@/assets/wedding-package.jpg";
import birthdayImage from "@/assets/birthday-package.jpg";
import corporateImage from "@/assets/corporate-package.jpg";
import receptionImage from "@/assets/reception-package.jpg";

interface Package {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  max_guests: number;
  duration_hours: number;
  is_active: boolean;
  image_url: string | null;
}

const categoryImages: Record<string, string> = {
  wedding: weddingImage,
  birthday: birthdayImage,
  corporate: corporateImage,
  reception: receptionImage,
};

const categoryLabels: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  corporate: "Corporate",
  reception: "Reception",
};

export function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = ''; // Relative path because frontend is served by backend


  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/packages");
      setPackages(data.filter((pkg: Package) => pkg.is_active));
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    }
    setLoading(false);
  };

  const filteredPackages = selectedCategory === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ["all", ...Array.from(new Set(packages.map(p => p.category.toLowerCase())))];

  const handleBookPackage = (packageId: string) => {
    if (!user) {
      navigate(`/auth?redirect=/book?package=${packageId}`);
    } else {
      navigate(`/book?package=${packageId}`);
    }
  };

  return (
    <section id="packages" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-elegant text-xl mb-2">Our Services</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Event Packages</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from our carefully curated packages designed to make your special day truly unforgettable.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Packages" : categoryLabels[category] || category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg, index) => (
              <Card 
                key={pkg.id} 
                className="group hover:border-primary/50 hover:shadow-gold overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image_url ? `${API_URL}${pkg.image_url}` : categoryImages[pkg.category.toLowerCase()] || weddingImage}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground capitalize">
                    {categoryLabels[pkg.category.toLowerCase()] || pkg.category}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{pkg.description}</p>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gradient-gold">
                      ₹{pkg.base_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted-foreground text-sm">starting</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Up to {pkg.max_guests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{pkg.duration_hours}h</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => handleBookPackage(pkg.id)}
                  >
                    Book This Package
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredPackages.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No packages found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
