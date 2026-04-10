import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({path: './server/.env'});

const test = async () => {
    try {
        const response = await axios.get("https://newsdata.io/api/1/latest", {
            params: {
                apikey: process.env.NEWS_API_KEY || 'd325b359cf9d4b67b0e6876ff0899c38',
                q: "agriculture OR farming",
                language: "en"
            }
        });
        console.log("Success:", response.data.results.length, "articles");
    } catch(e) {
        console.log("Error:", e.response?.data || e.message);
    }
}
test();
