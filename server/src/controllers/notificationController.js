import { Notification } from "../models/Notification.js";
import { runEngine, runAI, getAnalytics, sendManualOrderReminder } from "../services/notificationService.js";

export const getAll = async (req, res) => {
    const data = await Notification.findAll({
        order: [["created_at", "DESC"]]
    });
    res.json(data);
};

export const run = async (req, res) => {
    await runEngine();
    await runAI();
    res.json({ message: "Engine + AI executed" });
};

export const analytics = async (req, res) => {
    const data = await getAnalytics();
    res.json(data);
};

export const open = async (req, res) => {
    await Notification.update(
        { is_opened: true, opened_at: new Date() },
        { where: { id: req.params.id } }
    );
    res.json({ message: "opened tracked" });
};

export const click = async (req, res) => {
    await Notification.update(
        { is_clicked: true, clicked_at: new Date() },
        { where: { id: req.params.id } }
    );
    res.json({ message: "clicked tracked" });
};

export const remind = async (req, res) => {
    try {
        await sendManualOrderReminder(req.params.orderId);
        res.json({ success: true, message: "Reminder dispatched successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const deleted = await Notification.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ success: true, message: "Notification deleted" });
        } else {
            res.status(404).json({ success: false, message: "Notification not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};