import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";

interface Package {
    id: string;
    name: string;
    description: string;
    base_price: number;
    image_url: string | null;
}

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const packageId = searchParams.get("package");

    const [pkg, setPackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date());
    const API_URL = 'http://localhost:3000';

    useEffect(() => {
        if (!packageId) {
            toast.error("No package selected.");
            navigate("/");
            return;
        }

        const fetchPackage = async () => {
            try {
                const { data } = await api.get(`/packages/${packageId}`);
                setPackage(data);
            } catch (error) {
                toast.error("Failed to load package details.");
                console.error(error);
            }
            setLoading(false);
        };

        fetchPackage();
    }, [packageId, navigate]);

    const handleBooking = async () => {
        if (!user || !pkg || !bookingDate) {
            toast.error("Please log in and select a date to book.");
            return;
        }

        try {
            await api.post("/bookings", {
                package_id: pkg.id,
                booking_date: bookingDate.toISOString(),
                total_price: pkg.base_price,
            });
            toast.success("Booking successful! We will contact you shortly.");
            navigate("/");
        } catch (error) {
            toast.error("Booking failed. Please try again.");
            console.error(error);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading package details...</div>;
    }

    if (!pkg) {
        return <div className="container mx-auto px-4 py-8">Could not find the selected package.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Confirm Your Booking</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold">{pkg.name}</h2>
                    <p className="text-muted-foreground mt-2">{pkg.description}</p>
                    <p className="text-2xl font-bold text-gradient-gold mt-4">₹{pkg.base_price.toLocaleString('en-IN')}</p>
                    {pkg.image_url && (
                        <img src={`${API_URL}${pkg.image_url}`} alt={pkg.name} className="rounded-lg mt-4 w-full object-cover" />
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">Select Your Event Date</h3>
                    <Calendar
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                    />
                    <Button onClick={handleBooking} className="mt-8 w-full" variant="hero" disabled={!bookingDate}>
                        {bookingDate ? `Book for ${format(bookingDate, "PPP")}` : "Please select a date"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
