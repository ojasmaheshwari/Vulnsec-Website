export const ENVIRONMENT = "PROD"; // Change to "PROD" for production
export const SERVER_URL = ENVIRONMENT === "DEV" ? "https://localhost" : "https://vulnsec-server.onrender.com";
export const CLIENT_URL = "https://vulnsec.netlify.app"

export const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dfjnshwx5/upload";
export const UPLOAD_PRESET = "vulnsec";
