import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_key',
    DATABASE_URL: process.env.DATABASE_URL,
    
    // External APIs
    GOOGLE_PLACES_KEY: process.env.GOOGLE_PLACES_API_KEY,
    GOOGLE_GEO_KEY: process.env.GOOGLE_GEOCODING_API_KEY,
    PLANTNET_KEY: process.env.PLANTNET_API_KEY,
    NEWS_KEY: process.env.NEWS_API_KEY,
    
    // Internal Service URLs
    BASE_API_URL: process.env.VITE_API_URL || 'http://localhost:5001/api'
};

export default ENV;
