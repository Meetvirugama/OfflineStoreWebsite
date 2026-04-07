import express from "express";
import Analytics from "../models/Analytics.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// TRACK CLICK
router.post("/click", authMiddleware, async (req, res) => {
  try {
    const { page } = req.body;

    await Analytics.create({
      type: "CLICK",
      page,
      user_id: req.user?.id || null,
    });

    res.json({ message: "Click tracked" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;