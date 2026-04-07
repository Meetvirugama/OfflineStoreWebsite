import { Cart } from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { createOrderService } from "./orderService.js";

// ADD TO CART
export const addToCartService = async ({ customer_id, product_id, quantity }) => {

    if (!customer_id || !product_id || !quantity) {
        throw new Error("customer_id, product_id, quantity required");
    }

    let cart = await Cart.findOne({
        where: { customer_id, status: "ACTIVE" }
    });

    if (!cart) {
        cart = await Cart.create({ customer_id });
    }

    let item = await CartItem.findOne({
        where: { cart_id: cart.id, product_id }
    });

    if (item) {
        item.quantity += quantity;
        await item.save();
    } else {
        await CartItem.create({
            cart_id: cart.id,
            product_id,
            quantity
        });
    }

    return { message: "Item added to cart" };
};

// GET CART
export const getCartService = async (customer_id) => {

    const cart = await Cart.findOne({
        where: { customer_id, status: "ACTIVE" }
    });

    if (!cart) {
        return { items: [], total: 0, discount: 0, final: 0 };
    }

    const items = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [{
            model: Product,
            attributes: ["id", "name", "selling_price"]
        }]
    });

    const customer = await Customer.findByPk(customer_id);
    const discountPercent = customer?.discount_percent || 0;

    let total = 0;
    let totalDiscount = 0;

    const formattedItems = items.map(i => {
        const price = i.Product.selling_price;
        const qty = i.quantity;
        const itemTotal = price * qty;
        const discount = (itemTotal * discountPercent) / 100;
        const final = itemTotal - discount;

        total += itemTotal;
        totalDiscount += discount;

        return {
            id: i.id,
            product_id: i.product_id,
            name: i.Product.name,
            price,
            quantity: qty,
            total: itemTotal,
            discount,
            final
        };
    });

    return {
        items: formattedItems,
        total,
        discount: totalDiscount,
        final: total - totalDiscount
    };
};

// UPDATE CART ITEM QTY
export const updateCartService = async (id, quantity) => {
    const item = await CartItem.findByPk(id);
    if (!item) throw new Error("Cart item not found");

    if (quantity <= 0) {
        // 🔥 FIX: delete item instead of setting qty to 0
        await item.destroy();
        return { message: "Item removed from cart" };
    }

    item.quantity = quantity;
    await item.save();
    return item;
};

// DELETE CART ITEM
export const deleteCartItemService = async (id) => {
    const item = await CartItem.findByPk(id);
    if (!item) throw new Error("Cart item not found");
    await item.destroy();
    return { message: "Item removed" };
};

// CHECKOUT
export const checkoutService = async (data) => {

    const { customer_id, created_by } = data;

    const cart = await Cart.findOne({
        where: { customer_id, status: "ACTIVE" }
    });

    if (!cart) throw new Error("Cart not found");

    const items = await CartItem.findAll({
        where: { cart_id: cart.id }
    });

    if (items.length === 0) throw new Error("Cart is empty");

    const formattedItems = items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity
    }));

    const order = await createOrderService({
        customer_id,
        items: formattedItems,
        created_by
    });

    // Clear cart items after successful checkout
    await CartItem.destroy({
        where: { cart_id: cart.id }
    });

    return order;
};