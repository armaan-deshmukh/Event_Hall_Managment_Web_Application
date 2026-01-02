import { Router, Request, Response } from "express";
import { getDbConnection } from "../db/database";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET all packages (public)
router.get("/", async (req: Request, res: Response) => {
    const db = await getDbConnection();
    try {
        const packages = await db.all("SELECT * FROM packages");
        res.status(200).json(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET a single package by ID (public)
router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await getDbConnection();
    try {
        const pkg = await db.get("SELECT * FROM packages WHERE id = ?", [id]);
        if (pkg) {
            res.status(200).json(pkg);
        } else {
            res.status(404).json({ message: "Package not found" });
        }
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Admin-only routes below
router.use(authenticateToken);
router.use(authorizeRoles(['admin']));

// POST a new package
router.post("/", upload.single('image'), async (req: Request, res: Response) => {
    if (req.fileValidationError) {
        return res.status(400).send({ message: req.fileValidationError });
    }
    const { name, category, description, base_price, max_guests, duration_hours, is_active } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!name || !category || !base_price || !max_guests || !duration_hours) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await getDbConnection();
    const id = uuidv4();

    try {
        await db.run(
            `INSERT INTO packages (id, name, category, description, base_price, max_guests, duration_hours, is_active, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, category, description, base_price, max_guests, duration_hours, is_active ?? true, imageUrl]
        );
        res.status(201).json({ message: "Package created successfully", id });
    } catch (error) {
        console.error("Error creating package:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// PUT (update) a package
router.put("/:id", upload.single('image'), async (req: Request, res: Response) => {
    if (req.fileValidationError) {
        return res.status(400).send({ message: req.fileValidationError });
    }
    const { id } = req.params;
    const { name, category, description, base_price, max_guests, duration_hours, is_active } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name || !category || !base_price || !max_guests || !duration_hours) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    const db = await getDbConnection();

    try {
        if (imageUrl !== undefined) {
            // If a new image is uploaded, update the image_url field
            await db.run(
                `UPDATE packages SET 
                    name = ?, category = ?, description = ?, base_price = ?, 
                    max_guests = ?, duration_hours = ?, is_active = ?, image_url = ?
                 WHERE id = ?`,
                [name, category, description, base_price, max_guests, duration_hours, is_active, imageUrl, id]
            );
        } else {
            // If no new image is uploaded, keep the existing one
            await db.run(
                `UPDATE packages SET 
                    name = ?, category = ?, description = ?, base_price = ?, 
                    max_guests = ?, duration_hours = ?, is_active = ?
                 WHERE id = ?`,
                [name, category, description, base_price, max_guests, duration_hours, is_active, id]
            );
        }
        
        const result = await db.get("SELECT changes() as changes");

        if (result.changes === 0) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json({ message: "Package updated successfully" });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE a package
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await getDbConnection();

    try {
        // TODO: Also delete the image file from the uploads folder
        const result = await db.run("DELETE FROM packages WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
