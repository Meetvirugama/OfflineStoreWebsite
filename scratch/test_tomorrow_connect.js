import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const key = process.env.TOMORROW_API_KEY;
console.log('Testing Key:', key);

const url = `https://api.tomorrow.io/v4/weather/forecast?location=21.1702,72.8311&apikey=${key}`;

async function test() {
    try {
        const res = await axios.get(url);
        console.log('SUCCESS!');
        console.log('Current Temp:', res.data.timelines.hourly[0].values.temperature);
        process.exit(0);
    } catch (err) {
        console.log('FAILED:', err.response?.data || err.message);
        process.exit(1);
    }
}

test();
