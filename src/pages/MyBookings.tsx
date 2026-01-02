import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Booking {
    id: string;
    booking_date: string;
    status: "pending" | "confirmed" | "cancelled";
    total_price: number;
    package_name: string;
    package_image_url: string | null;
}

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:3000';

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get("/bookings/my-bookings");
                setBookings(data);
            } catch (error) {
                toast.error("Failed to fetch your bookings.");
                console.error(error);
            }
            setLoading(false);
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading your bookings...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                            {booking.package_image_url && (
                                <img 
                                    src={`${API_URL}${booking.package_image_url}`} 
                                    alt={booking.package_name}
                                    className="h-48 w-full object-cover"
                                />
                            )}
                            <CardHeader>
                                <CardTitle>{booking.package_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Event Date:</strong> {format(new Date(booking.booking_date), "PPP")}</p>
                                <p><strong>Total Price:</strong> ₹{booking.total_price.toLocaleString('en-IN')}</p>
                                <p><strong>Status:</strong> <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>{booking.status}</Badge></p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
