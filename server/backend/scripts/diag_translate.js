import { translateText } from './server/backend/utils/translate.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    console.log("--- TRANSLATION TEST START ---");
    const input = "Fresh Organic Tomatoes from local farm";
    console.log(`Input: ${input}`);
    
    try {
        const result = await translateText(input, 'gu');
        console.log(`Result (GU): ${result}`);
        
        if (result === input) {
            console.log("❌ FAILED: Returned original text. Check API Keys/Connectivity.");
        } else {
            console.log("✅ SUCCESS: Translation returned.");
        }
    } catch (err) {
        console.error("❌ ERROR:", err.message);
    }
    console.log("--- TEST END ---");
};

test();
