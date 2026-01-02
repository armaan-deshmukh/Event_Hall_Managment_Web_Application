import { Router, Request, Response } from "express";
import { getDbConnection } from "../db/database";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware";
import { v4 as uuidv4 } from "uuid";

interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string };
}

const router = Router();

// All routes are protected
router.use(authenticateToken);

// GET bookings for the logged-in user
router.get("/my-bookings", async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const db = await getDbConnection();
    try {
        const bookings = await db.all(`
            SELECT 
                b.id, b.booking_date, b.status, b.total_price, b.created_at,
                p.name as package_name, p.image_url as package_image_url
            FROM bookings b
            JOIN packages p ON b.package_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `, [userId]);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET all bookings (admin only)
router.get("/", authorizeRoles(['admin']), async (req: Request, res: Response) => {
    const db = await getDbConnection();
    try {
        const bookings = await db.all(`
            SELECT 
                b.id, b.booking_date, b.status, b.total_price, b.created_at,
                u.full_name as user_name, u.email as user_email,
                p.name as package_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN packages p ON b.package_id = p.id
            ORDER BY b.created_at DESC
        `);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST a new booking (authenticated user)
router.post("/", async (req: AuthRequest, res: Response) => {
    const { package_id, booking_date, total_price } = req.body;
    const user_id = req.user?.id;

    if (!package_id || !booking_date || !total_price) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await getDbConnection();
    const id = uuidv4();

    try {
        await db.run(
            `INSERT INTO bookings (id, user_id, package_id, booking_date, total_price, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [id, user_id, package_id, booking_date, total_price]
        );
        res.status(201).json({ message: "Booking created successfully", id });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// PUT (update) a booking's status (admin only)
router.put("/:id/status", authorizeRoles(['admin']), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
    }
    
    const db = await getDbConnection();

    try {
        const result = await db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking status updated successfully" });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE a booking (admin only)
router.delete("/:id", authorizeRoles(['admin']), async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await getDbConnection();

    try {
        const result = await db.run("DELETE FROM bookings WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
