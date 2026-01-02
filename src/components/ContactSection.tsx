import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ContactSection() {
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
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map/Image Side */}
          <div className="relative rounded-2xl overflow-hidden h-96 lg:h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4316.602422834035!2d74.9498812749803!3d19.531583241005798!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc834aece29e91%3A0xe31fcef5dd692785!2sShri%20Dnyaneshwar%20Mahavidylaya%20Newasa!5e0!3m2!1sen!2sin!4v1767275925567!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(30%) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Grand Elegance Hall Location"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-primary font-elegant text-xl mb-2">Get in Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Visit</span> Our Venue
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Schedule a tour to experience the elegance firsthand. Our team is ready to help you plan your perfect event.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-muted-foreground">Newasa Fhata Road, Newasa kh, Ahmednagar, Maharashtra</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-muted-foreground">+(91) 8999116365</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-muted-foreground">info@grandelegancehall.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Business Hours</h4>
                  <p className="text-muted-foreground">Monday - Sunday: 9:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" onClick={handleBooking}>
                Book an Appointment
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+15551234567">Call Us Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
