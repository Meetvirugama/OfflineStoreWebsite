import express from "express";
import { createOrder, getOrderById, getOrderItems } from "../controllers/orderController.js";
import Orders from "../models/Orders.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { Customer, User } from "../models/index.js";

const router = express.Router();

// 🟢 GET ALL ORDERS (Admin/Staff: all | Customer: own orders only)
router.get("/",
    authMiddleware,
    async (req, res) => {
        try {
            console.log(`📦 Order Request: User=${req.user.id}, Role=${req.user.role}`);
            let where = {};

            if (req.user.role === "CUSTOMER") {
                const { customer_id } = req.query;
                if (!customer_id) return res.json([]);
                where = { customer_id };
            } else if (req.query.customer_id) {
                where = { customer_id: req.query.customer_id };
                console.log(`🔍 Admin filtering by customer_id: ${req.query.customer_id}`);
            }

            const orders = await Orders.findAll({
                where,
                order: [["id", "DESC"]],
                include: [
                    {
                        model: Customer,
                        required: false,
                        include: [{
                            model: User,
                            required: false,
                            attributes: ["id", "name", "email"]
                        }]
                    }
                ]
            });

            console.log(`📈 Found ${orders.length} orders for Admin/User`);
            res.json(orders);
        } catch (err) {
            console.error("❌ Orders Fetch Error:", err.message);
            res.status(500).json({ message: err.message });
        }
    }
);

// 🟢 GET SINGLE ORDER (with items)
router.get("/:id",
    authMiddleware,
    getOrderById
);

// 🟢 GET ORDER ITEMS
router.get("/:id/items",
    authMiddleware,
    getOrderItems
);

// 🔵 CREATE ORDER (Admin/Staff/Customer)
router.post("/",
    authMiddleware,
    allowRoles("ADMIN", "STAFF", "CUSTOMER"),
    createOrder
);

export default router;