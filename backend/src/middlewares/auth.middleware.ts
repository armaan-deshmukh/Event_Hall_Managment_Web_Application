import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user as { id: string; email: string; role: string };
        next();
    });
};

export const authorizeRoles = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have the necessary permissions" });
        }
        next();
    };
};
