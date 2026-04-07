import {
    addToCartService,
    getCartService,
    updateCartService,
    deleteCartItemService,
    checkoutService
} from "../services/cartService.js";

export const addToCart = async (req, res) => {
    try {
        const data = await addToCartService(req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const data = await getCartService(req.params.customer_id);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const data = await updateCartService(req.params.id, req.body.quantity);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const data = await deleteCartItemService(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const checkout = async (req, res) => {
    try {
        const body = {
            ...req.body,
            created_by: req.user.id  // 🔥 Always use JWT user id
        };

        const data = await checkoutService(body);

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error("CHECKOUT ERROR:", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};