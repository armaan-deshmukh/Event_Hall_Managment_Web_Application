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
import { User } from "@/hooks/useAuth"; // Using the User type from our new auth hook

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<User[]>("/users");
            setUsers(data);
        } catch (error: any) {
            toast.error("Error fetching users: " + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    const deleteUser = async (userId: string) => {
        try {
            await api.delete(`/users/${userId}`);
            toast.success("User deleted successfully");
            fetchUsers(); // Refresh the list
        } catch (error: any) {
            toast.error("Error deleting user: " + (error.response?.data?.message || error.message));
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);
    
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "full_name",
            header: "Full Name",
        },
        {
            accessorKey: "role",
            header: "Role",
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
        {
            accessorKey: "last_sign_in_at",
            header: "Last Sign In",
            cell: ({ row }) => row.original.last_sign_in_at ? new Date(row.original.last_sign_in_at).toLocaleDateString() : "Never",
        },
        {
            id: "actions",
            cell: ({ row }) => {
              const user = row.original;
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => alert("Make admin functionality to be implemented")}
                    >
                        Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">User Management</h2>
            </div>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <DataTable columns={columns} data={users} />
            )}
        </div>
    );
};

export default UserManagement;
