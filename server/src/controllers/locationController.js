import { saveUserLocation, listUserLocations, setDefaultLocation, searchLocation } from "../services/locationService.js";

/**
 * SEARCH LOCATIONS (PUBLIC)
 */
export const searchLocations = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false, message: "Search query required" });
        const results = await searchLocation(q);
        res.json(results);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * SAVE LOCATION
 */
export const addLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const location = await saveUserLocation(userId, req.body);
        res.json({ success: true, location });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * LIST LOCATIONS
 */
export const getMyLocations = async (req, res) => {
    try {
        const userId = req.user.id;
        const locations = await listUserLocations(userId);
        res.json({ success: true, locations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * SET DEFAULT
 */
export const updateDefault = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await setDefaultLocation(userId, id);
        res.json({ success: true, message: "Default location updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
