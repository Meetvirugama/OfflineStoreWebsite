import { translateText } from '../utils/translate.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testAgriFields = async () => {
    console.log("--- AGRI FIELD TRANSLATION TEST START ---");
    
    const fields = {
        commodity: "Wheat",
        market: "Junagadh",
        district: "Rajkot",
        state: "Gujarat",
        crop: "Cotton"
    };

    console.log("Testing fields:", fields);

    for (const [key, value] of Object.entries(fields)) {
        try {
            const result = await translateText(value, 'gu');
            console.log(`[${key.toUpperCase()}] ${value} -> ${result}`);
            
            if (result === value) {
                console.warn(`❌ FAILED: ${key} was not translated.`);
            } else {
                console.log(`✅ SUCCESS: ${key} translated.`);
            }
        } catch (err) {
            console.error(`❌ ERROR for ${key}:`, err.message);
        }
    }
    
    console.log("--- TEST END ---");
};

testAgriFields();
