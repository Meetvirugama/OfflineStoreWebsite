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
export const DB_NAME = process.env.DB_NAME || 'erp_system';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '09012007';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_DIALECT = process.env.DB_DIALECT || 'postgres';
export const RAZORPAY_KEY = process.env.RAZORPAY_KEY || '';
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5001/api/auth/google/callback';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log("📂 Environment loaded and JWT_SECRET ready (hoisting fix active)");
