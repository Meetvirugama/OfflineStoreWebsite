import { verifySMTP } from "../server/backend/utils/email.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "server/.env") });

async function test() {
    console.log("Checking EMAIL:", process.env.EMAIL);
    console.log("Checking EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "MISSING");
    const success = await verifySMTP();
    if (success) {
        console.log("✅ SMTP Verification SUCCESSFUL");
    } else {
        console.log("❌ SMTP Verification FAILED");
    }
}

test();
