import { Router, Request, Response } from "express";
import { getDbConnection } from "../db/database";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// All routes in this file are protected and for admins only
router.use(authenticateToken);
router.use(authorizeRoles(['admin']));

// GET /api/users - Get all users
router.get("/", async (req: Request, res: Response) => {
    const db = await getDbConnection();
    try {
        const users = await db.all("SELECT id, email, full_name, role, created_at, last_sign_in_at FROM users");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await getDbConnection();
    try {
        const result = await db.run("DELETE FROM users WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
