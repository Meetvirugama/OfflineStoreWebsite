import express from "express";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🟢 GET MY PROFILE (Unified: Customer or Admin)
router.get("/me",
  authMiddleware,
  allowRoles("CUSTOMER", "ADMIN"),
  async (req, res) => {
    try {
      const customer = await Customer.findOne({
        where: { user_id: req.user.id }
      });

      const userFull = await User.findByPk(req.user.id, {
        attributes: ["id", "name", "email", "role"]
      });

      if (!customer) {
        return res.json(userFull);
      }

      // Return combined data
      res.json({
        ...customer.toJSON(),
        role: userFull.role,
        email: userFull.email
      });
    } catch (err) {
      console.error("❌ Error in /me/me route:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 🟡 UPDATE MY PROFILE
router.put("/me",
  authMiddleware,
  allowRoles("CUSTOMER"),
  async (req, res) => {
    try {
      const customer = await Customer.findOne({
        where: { user_id: req.user.id }
      });

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      await customer.update(req.body);

      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;