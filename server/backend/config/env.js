import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const ENV = {
    PORT: Number(process.env.PORT) || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_key_change_me',
    DATABASE_URL: process.env.DATABASE_URL,
    
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI || 'https://agroplatform.app/api/auth/google/callback',

    // External Service Keys
    GOOGLE_PLACES_KEY: process.env.GOOGLE_PLACES_API_KEY,
    GOOGLE_GEO_KEY: process.env.GOOGLE_GEOCODING_API_KEY,
    PLANTNET_KEY: process.env.PLANTNET_API_KEY,
    NEWS_KEY: process.env.NEWS_API_KEY,
    DATA_GOV_KEY: process.env.DATA_GOV_API_KEY || process.env.DATA_GOV_KEY,
    WEATHER_KEY: process.env.WEATHER_API_KEY,
    TOMORROW_KEY: process.env.TOMORROW_API_KEY,
    GROQ_KEY: process.env.GROQ_API_KEY,
    
    // Geospatial API Overrides (Optional)
    OVERPASS_API_URL: process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter',
    NOMINATIM_URL: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search',

    // Internal Service URLs
    BASE_API_URL: process.env.BASE_API_URL || 'https://agroplatform.app/api',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.agroplatform.app',
    
    // AI & Translation Services
    HF_TOKEN: process.env.HF_TOKEN,
    TRANSLATE_API_URL: process.env.TRANSLATE_API_URL || 'http://localhost:5000/translate',
    EMAIL: process.env.EMAIL || 'meetvirugama4902@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS,
};

export default ENV;
