"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import api from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// New Booking type based on the backend API response
type Booking = {
  id: string;
  booking_date: string;
  status: "pending" | "confirmed" | "cancelled";
  total_price: number;
  created_at: string;
  user_name: string;
  user_email: string;
  package_name: string;
};

const BookingManagement = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<Booking[]>("/bookings");
            setBookings(data);
        } catch (error: any) {
            toast.error("Error fetching bookings: " + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    const updateBookingStatus = async (bookingId: string, status: "confirmed" | "cancelled") => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error: any) {
            toast.error(`Failed to update booking: ${error.response?.data?.message || error.message}`);
        }
    };
    
    useEffect(() => {
        fetchBookings();
    }, []);

    const columns: ColumnDef<Booking>[] = [
        { accessorKey: "package_name", header: "Package" },
        { accessorKey: "user_name", header: "Customer" },
        {
            accessorKey: "booking_date",
            header: "Event Date",
            cell: ({ row }) => new Date(row.original.booking_date).toLocaleDateString(),
        },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "total_price",
            header: "Total Price",
            cell: ({ row }) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.original.total_price),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => updateBookingStatus(row.original.id, "confirmed")}>
                        Confirm Booking
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateBookingStatus(row.original.id, "cancelled")} className="text-red-500">
                        Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Booking Management</h2>
            </div>
            {loading ? <p>Loading bookings...</p> : <DataTable columns={columns} data={bookings} />}
        </div>
    );
};

export default BookingManagement;
