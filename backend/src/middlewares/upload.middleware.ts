import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the multer instance
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            // Rejects the file, but doesn't throw an error that crashes the app
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
        }
        cb(null, true);
    }
});

// Extend the Request interface to include the custom error property
declare global {
    namespace Express {
        export interface Request {
            fileValidationError?: string;
        }
    }
}


export default upload;
