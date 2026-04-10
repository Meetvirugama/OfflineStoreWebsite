
import axios from "axios";

const API_KEY = "579b464db66ec23bdd000001451a9d7829b546876f16c0ac968d9b54";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

async function testApi() {
    const crop = "Cotton";
    const district = "Rajkot";
    const state = "Gujarat";

    const params = {
        "api-key": API_KEY,
        format: "json",
        limit: 100,
        "filters[commodity]": crop,
        "filters[state]": state,
        "filters[district]": district,
        sort: "arrival_date desc"
    };

    try {
        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, { params });
        console.log("Status:", response.status);
        console.log("Total records:", response.data.total);
        console.log("Records returned:", response.data.records.length);
        if (response.data.records.length > 0) {
            console.log("Sample record:", response.data.records[0]);
            console.log("Dates returned:", response.data.records.map(r => r.arrival_date).slice(0, 5));
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testApi();
