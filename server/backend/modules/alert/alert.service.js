import PriceAlert from "./alert.model.js";
import Notification from "../notification/notification.model.js";

export const setAlert = async (userId, data) => {
    return await PriceAlert.create({ ...data, user_id: userId });
};

export const getMyAlerts = async (userId) => {
    return await PriceAlert.findAll({ where: { user_id: userId } });
};

export const deleteAlert = async (userId, id) => {
    return await PriceAlert.destroy({ where: { id, user_id: userId } });
};

/**
 * Background Check logic (conceptual for this refactor)
 */
export const checkAlerts = async (commodity, currentPrice) => {
    const alerts = await PriceAlert.findAll({ 
        where: { commodity, is_active: true } 
    });

    for (const alert of alerts) {
        let triggered = false;
        if (alert.condition === "ABOVE" && currentPrice >= alert.target_price) triggered = true;
        if (alert.condition === "BELOW" && currentPrice <= alert.target_price) triggered = true;

        if (triggered) {
            await Notification.create({
                user_id: alert.user_id,
                title: "Price Alert Triggered! 🔔",
                message: `The price of ${commodity} has reached your target of ₹${alert.target_price}. Current: ₹${currentPrice}`,
                type: "ALERT"
            });
            await alert.update({ is_read: true, is_active: false }); // One-time trigger
        }
    }
};
