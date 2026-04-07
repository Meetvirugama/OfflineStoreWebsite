import {
    createOrderService,
    getOrderByIdService
} from "../services/orderService.js";
import Orders from "../models/Orders.js";
import { OrderItem } from "../models/index.js";
import Product from "../models/Product.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
    try {
        const body = {
            ...req.body,
            created_by: req.user.id
        };

        const data = await createOrderService(body);
        res.status(201).json(data);
    } catch (err) {
        console.error(err);

        const statusCode =
            err.message.includes("not found") ? 404 :
            err.message.includes("Insufficient") ? 400 :
            err.message.includes("Credit limit") ? 400 :
            500;

        res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }
};

// GET ORDER BY ID (with items)
export const getOrderById = async (req, res) => {
    try {
        const data = await getOrderByIdService(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// GET ORDER ITEMS
export const getOrderItems = async (req, res) => {
    try {
        const items = await OrderItem.findAll({
            where: { order_id: req.params.id },
            include: [{ model: Product, attributes: ["id", "name", "selling_price", "mrp"] }]
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};