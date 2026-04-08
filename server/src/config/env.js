import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔍 ROBUST ESM PATH (Gives us /server/.env regardless of CWD)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

if (!process.env.RAZORPAY_KEY) {
  console.warn("⚠️  RAZORPAY_KEY missing at: " + envPath);
}

export const JWT_SECRET = process.env.JWT_SECRET || 'agromart_forest_system_2026_secure_key';
export const DATABASE_URL = process.env.DATABASE_URL;
export const RAZORPAY_KEY = process.env.RAZORPAY_KEY || '';
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI || 'https://offlinestorewebsite.onrender.com/api/auth/google/callback';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://offline-store-website.vercel.app';

console.log("📂 Environment loaded and JWT_SECRET ready (hoisting fix active)");
