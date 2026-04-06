import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { initializeDatabase } from "./db/database";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import packageRouter from "./routes/package.routes";
import bookingRouter from "./routes/booking.routes";
import path from "path";

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/packages", packageRouter);
app.use("/api/bookings", bookingRouter);

// --- FRONTEND DEPLOYMENT CONFIG ---
// 1. Serve static files from the frontend's build folder
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// 2. Fallback: For all other requests, send the index.html (Supports React Router/SPA)
app.get('*path', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});
// ----------------------------------

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}).catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
});
