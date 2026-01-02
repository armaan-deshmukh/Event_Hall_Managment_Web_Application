import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db/database";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/register", async (req: Request, res: Response) => {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const db = await getDbConnection();

    try {
        const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return res.status(409).json({ message: "User with that email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await db.run(
            "INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
            [id, email, hashedPassword, full_name, "user"]
        );

        const token = jwt.sign({ id, email, role: "user" }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token, user: { id, email, full_name, role: "user" } });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const db = await getDbConnection();

    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        // Update last_sign_in_at
        await db.run("UPDATE users SET last_sign_in_at = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

        res.status(200).json({ message: "Logged in successfully", token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
