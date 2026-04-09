import Cart from "./cart.model.js";
import CartItem from "./cart_item.model.js";
import Product from "../product/product.model.js";
import Customer from "../customer/customer.model.js";

const getCustomer = async (userId) => {
    let customer = await Customer.findOne({ where: { user_id: userId } });
    if (!customer) {
        // Find by ID directly as fallback if user_id mapping is stale
        customer = await Customer.findByPk(userId);
    }
    
    if (!customer) {
        // Auto-provision customer record for authenticated users to ensure cart accessibility
        customer = await Customer.create({ 
            user_id: userId, 
            name: "Verified User", 
            mobile: `99${Math.floor(Math.random() * 90000000 + 10000000)}` // Virtual tokenized mobile
        });
    }
    return customer;
};

export const getCart = async (userId) => {
    const customer = await getCustomer(userId);
    let cart = await Cart.findOne({ where: { customer_id: customer.id } });
    if (!cart) cart = await Cart.create({ customer_id: customer.id });

    const items = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [{ model: Product, attributes: ["id", "name", "selling_price", "image"] }]
    });

    return { cartId: cart.id, items };
};

export const addItem = async (userId, productId, quantity) => {
    const customer = await getCustomer(userId);
    let cart = await Cart.findOne({ where: { customer_id: customer.id } });
    if (!cart) cart = await Cart.create({ customer_id: customer.id });

    let item = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId } });
    if (item) {
        await item.update({ quantity: item.quantity + quantity });
    } else {
        await CartItem.create({ cart_id: cart.id, product_id: productId, quantity });
    }
};

export const removeItem = async (cartItemId) => {
    await CartItem.destroy({ where: { id: cartItemId } });
};

export const clearCart = async (userId) => {
    const customer = await Customer.findOne({ where: { user_id: userId } });
    if (!customer) return;
    const cart = await Cart.findOne({ where: { customer_id: customer.id } });
    if (cart) await CartItem.destroy({ where: { cart_id: cart.id } });
};
