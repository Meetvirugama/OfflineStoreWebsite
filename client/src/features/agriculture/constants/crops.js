/**
 * HI-FIDELITY CROP CATALOG (Core UI Assets)
 * These crops have custom icons and colors for a premium look.
 */
export const CROP_CATALOG = [
    { id: 'cotton', name: 'Cotton', icon: '☁️', color: '#f8fafc' },
    { id: 'wheat', name: 'Wheat', icon: '🌾', color: '#fef3c7' },
    { id: 'groundnut', name: 'Groundnut', icon: '🥜', color: '#fef3c7' },
    { id: 'cumin', name: 'Cumin (Jeera)', icon: '🌿', color: '#ecfdf5' },
    { id: 'castor', name: 'Castor', icon: '🌱', color: '#f0fdf4' },
    { id: 'tomato', name: 'Tomato', icon: '🍅', color: '#fef2f2' },
    { id: 'onion', name: 'Onion', icon: '🧅', color: '#fdf2f8' },
    { id: 'potato', name: 'Potato', icon: '🥔', color: '#fffbeb' },
    { id: 'chilli', name: 'Chilli', icon: '🌶️', color: '#fff1f2' },
    { id: 'garlic', name: 'Garlic', icon: '🧄', color: '#f8fafc' },
    { id: 'ginger', name: 'Ginger', icon: '🫚', color: '#fefce8' },
    { id: 'banana', name: 'Banana', icon: '🍌', color: '#fefce8' },
    { id: 'mango', name: 'Mango', icon: '🥭', color: '#fffbeb' },
    { id: 'rice', name: 'Rice (Paddy)', icon: '🌾', color: '#f0fdfa' },
    { id: 'maize', name: 'Maize (Corn)', icon: '🌽', color: '#fefce8' },
    { id: 'bajra', name: 'Bajra (Pearl Millet)', icon: '🌾', color: '#fafaf9' },
    { id: 'mustard', name: 'Mustard', icon: '🌼', color: '#fef9c3' },
    { id: 'soybean', name: 'Soybean', icon: '🌱', color: '#f7fee7' },
    { id: 'pomegranate', name: 'Pomegranate', icon: '🍎', color: '#fff1f2' },
    { id: 'papaya', name: 'Papaya', icon: '🥭', color: '#fff7ed' }
];

/**
 * DYNAMIC MERGE UTILITY
 * Logic: Merges the hardcoded catalog with a discovered list from the Mandi API.
 * Ensures we have "accurate" selection options without losing premium UI metadata.
 */
export const getMergedCropCatalog = (discoveredList = []) => {
    // 1. Convert discovered strings into consistent IDs
    const normalizedDiscovered = discoveredList.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name
    }));

    // 2. Identify crops not already in our hi-fidelity catalog
    const existingIds = new Set(CROP_CATALOG.map(c => c.id));
    const newCrops = normalizedDiscovered
        .filter(d => !existingIds.has(d.id))
        .map(d => ({
            ...d,
            icon: '🌿', // Default icon for discovered staples
            color: '#f8fafc',
            isDiscovered: true
        }));

    // 3. Return full combined set, sorted by name
    return [...CROP_CATALOG, ...newCrops].sort((a, b) => a.name.localeCompare(b.name));
};

export const CROP_STAGES = [
    { id: 'sowing', name: 'Sowing/Planting', icon: '🌱' },
    { id: 'vegetative', name: 'Vegetative Growth', icon: '🌿' },
    { id: 'flowering', name: 'Flowering Stage', icon: '🌸' },
    { id: 'fruiting', name: 'Fruiting/Heading', icon: '🍎' },
    { id: 'ripening', name: 'Ripening/Maturity', icon: '🌾' },
    { id: 'harvesting', name: 'Harvesting', icon: '🚜' }
];

export default CROP_CATALOG;
