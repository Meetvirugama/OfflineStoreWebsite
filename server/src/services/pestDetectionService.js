import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * GUJARAT INTELLIGENCE LAYER
 * Localized knowledge database for primary Gujarat crops.
 */
const GUJARAT_ADVISORY = {
    "cotton": {
        "Leaf Spot": { solution: "Spray Carbendazim (1g/L)", organic: "Neem oil spray (5%)", severity: "Medium" },
        "Bollworm": { solution: "Spray Chlorpyrifos 20 EC", organic: "Pheromone traps & Trichogramma cards", severity: "High" },
        "Blight": { solution: "Spray Streptocycline + Copper Oxychloride", organic: "Pseudomonas fluorescens treatment", severity: "High" }
    },
    "groundnut": {
        "Rust": { solution: "Mancozeb spray (0.2%)", organic: "Compost extract or Trichoderma viride", severity: "High" },
        "Tikka Leaf Spot": { solution: "Carbendazim + Mancozeb spray", organic: "Seed treatment with Neem cake", severity: "Medium" }
    },
    "wheat": {
        "Rust": { solution: "Propiconazole 25 EC (1ml/L)", organic: "Neem oil or cow urine extract", severity: "High" },
        "Smut": { solution: "Seed treatment with Vitavax", organic: "Hot water treatment of seeds", severity: "Medium" }
    },
    "rice": {
        "Blast": { solution: "Tricyclazole 75 WP", organic: "Pseudomonas powder spray", severity: "High" },
        "Brown Spot": { solution: "Mancozeb 75 WP", organic: "Balanced Nitrogen application & Neem spray", severity: "Medium" }
    }
};

/**
 * IDENTIFY DISEASE VIA PLANTNET
 */
export const identifyDisease = async (imagePath) => {
    const API_KEY = process.env.PLANTNET_API_KEY || "2b10D09a63vP2it9M6P4y9S5u8"; // Fallback or env
    const BASE_URL = process.env.PLANTNET_BASE_URL || "https://my-api.plantnet.org";
    
    try {
        const form = new FormData();
        form.append('images', fs.createReadStream(imagePath));
        form.append('organs', 'leaf');

        console.log(`📡 Sending image to PlantNet: ${BASE_URL}/v2/diseases/identify`);
        
        const response = await axios.post(`${BASE_URL}/v2/diseases/identify?api-key=${API_KEY}`, form, {
            headers: form.getHeaders(),
            params: { "include-all": "true" }
        });

        // Parse top result
        const results = response.data.results || [];
        if (results.length === 0) return null;

        const bestMatch = results[0];
        return {
            plant: bestMatch.species?.scientificNameWithoutAuthor || "Unknown Plant",
            disease: bestMatch.gbif?.species || "General Pathogen", // PlantNet disease names can vary
            confidence: bestMatch.score * 100
        };

    } catch (err) {
        console.error("❌ PlantNet API Error:", err.response?.data || err.message);
        throw new Error("AI Identification failed. Please ensure the leaf is clearly visible.");
    }
};

/**
 * APPLY LOCAL KNOWLEDGE
 */
export const getLocalizedSolution = (crop, disease) => {
    const cropKey = crop.toLowerCase();
    const solutions = GUJARAT_ADVISORY[cropKey];

    if (!solutions) return null;

    // Simple keyword match for disease
    const diseaseMatch = Object.keys(solutions).find(d => 
        disease.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(disease.toLowerCase())
    );

    if (diseaseMatch) {
        return solutions[diseaseMatch];
    }

    // Default fallback
    return {
        solution: "Consult local KVK or Agriculture Officer for specific chemical treatment.",
        organic: "Apply general organic bio-fertilizer and maintain plant spacing.",
        severity: "Medium"
    };
};
