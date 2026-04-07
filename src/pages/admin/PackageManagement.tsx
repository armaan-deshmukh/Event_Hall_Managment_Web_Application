"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import api from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const packageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Name must be at least 3 characters"),
    category: z.string().min(2, "Category is required"),
    description: z.string().optional().nullable(),
    base_price: z.preprocess(
        (val) => (typeof val === 'string' ? parseFloat(val) : val),
        z.number().positive("Price must be a positive number")
    ),
    max_guests: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive("Max guests must be a positive number")
    ),
    duration_hours: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive("Duration must be a positive number")
    ),
    is_active: z.boolean().default(true),
    image: z.any().optional(),
});

type PackageFormData = z.infer<typeof packageSchema>;

export type Package = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price: number;
  max_guests: number;
  duration_hours: number;
  is_active: boolean;
  image_url: string | null;
};

const PackageManagement = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: { is_active: true }
    });

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<Package[]>("/packages");
            setPackages(data);
        } catch (error: any) {
            toast.error("Error fetching packages: " + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    const onSubmit = async (formData: PackageFormData) => {
        const data = new FormData();
        
        // Append all text fields
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('description', formData.description || '');
        data.append('base_price', formData.base_price.toString());
        data.append('max_guests', formData.max_guests.toString());
        data.append('duration_hours', formData.duration_hours.toString());
        data.append('is_active', formData.is_active.toString());

        // Append image if selected
        if (formData.image && formData.image[0]) {
            data.append('image', formData.image[0]);
        }

        try {
            if (editingPackage) {
                await api.put(`/packages/${editingPackage.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("Package updated successfully!");
            } else {
                await api.post("/packages", data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("Package created successfully!");
            }
            setDialogOpen(false);
            fetchPackages();
        } catch (error: any) {
            toast.error(`Failed to save package: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const deletePackage = async (packageId: string) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        try {
            await api.delete(`/packages/${packageId}`);
            toast.success("Package deleted successfully");
            fetchPackages();
        } catch (error: any) {
            toast.error(`Failed to delete package: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const handleEdit = (pkg: Package) => {
        setEditingPackage(pkg);
        setDialogOpen(true);
    };
    
    useEffect(() => {
        fetchPackages();
    }, []);

    useEffect(() => {
        if (isDialogOpen) {
            if (editingPackage) {
                reset({
                    name: editingPackage.name,
                    category: editingPackage.category,
                    description: editingPackage.description || '',
                    base_price: editingPackage.base_price,
                    max_guests: editingPackage.max_guests,
                    duration_hours: editingPackage.duration_hours,
                    is_active: editingPackage.is_active
                });
            } else {
                reset({
                    name: '', category: '', description: '', base_price: 0,
                    max_guests: 0, duration_hours: 0, is_active: true
                });
            }
        }
    }, [isDialogOpen, editingPackage, reset]);

    const columns: ColumnDef<Package>[] = [
        { 
            accessorKey: "image_url",
            header: "Image",
            cell: ({ row }) => {
                const imageUrl = row.original.image_url;
                return imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={row.original.name} 
                        className="h-12 w-12 object-cover rounded-md border" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }}
                    />
                ) : <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400">No Image</div>
            }
        },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "category", header: "Category" },
        {
            accessorKey: "base_price",
            header: ({ column }) => (
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Price <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
            cell: ({ row }) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.original.base_price),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.original.is_active;
                return <div className={`px-2 py-1 rounded-full text-xs font-medium text-center ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isActive ? "Active" : "Inactive"}</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => deletePackage(row.original.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Package Management</h2>
                <Button onClick={() => { setEditingPackage(null); setDialogOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{editingPackage ? 'Edit' : 'Create'} Package</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        {/* Form fields */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" {...register("name")} className="col-span-3" />
                            {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Input id="category" {...register("category")} className="col-span-3" />
                            {errors.category && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="base_price" className="text-right">Price</Label>
                            <Input id="base_price" type="number" {...register("base_price")} className="col-span-3" />
                            {errors.base_price && <p className="col-span-4 text-red-500 text-xs text-right">{errors.base_price.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">Image</Label>
                            <Input id="image" type="file" {...register("image")} className="col-span-3" />
                            {errors.image && <p className="col-span-4 text-red-500 text-xs text-right">{errors.image.message as string}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="max_guests" className="text-right">Max Guests</Label>
                            <Input id="max_guests" type="number" {...register("max_guests")} className="col-span-3" />
                            {errors.max_guests && <p className="col-span-4 text-red-500 text-xs text-right">{errors.max_guests.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration_hours" className="text-right">Duration (hrs)</Label>
                            <Input id="duration_hours" type="number" {...register("duration_hours")} className="col-span-3" />
                            {errors.duration_hours && <p className="col-span-4 text-red-500 text-xs text-right">{errors.duration_hours.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" {...register("description")} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="is_active" className="text-right">Active</Label>
                            <Controller name="is_active" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
                        </div>
                        <DialogFooter><Button type="submit">Save</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {loading ? <p>Loading...</p> : <DataTable columns={columns} data={packages} />}
        </div>
    );
};

export default PackageManagement;