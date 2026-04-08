import Cart from "./cart.model.js";
import CartItem from "./cart_item.model.js";
import Product from "../product/product.model.js";

export const getCart = async (userId) => {
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) cart = await Cart.create({ user_id: userId });

    const items = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [{ model: Product, attributes: ["name", "price"] }]
    });

    return { cartId: cart.id, items };
};

export const addItem = async (userId, productId, quantity) => {
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) cart = await Cart.create({ user_id: userId });

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
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (cart) await CartItem.destroy({ where: { cart_id: cart.id } });
};
