import sequelize from "../../config/db.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import Customer from "../customer/customer.model.js";

export const getAdminStats = async () => {
    const totalSales = await Order.sum("total_amount") || 0;
    const totalOrders = await Order.count();
    const totalCustomers = await Customer.count();
    const lowStockCount = await Product.count({ where: { stock: { [sequelize.Op.lt]: 10 } } });

    return {
        totalSales,
        totalOrders,
        totalCustomers,
        lowStockCount
    };
};

export const getFarmerStats = async (userId) => {
    const customer = await Customer.findOne({ where: { user_id: userId } });
    if (!customer) return { totalOrders: 0, totalSpent: 0 };

    const totalOrders = await Order.count({ where: { customer_id: customer.id } });
    const totalSpent = await Order.sum("total_amount", { where: { customer_id: customer.id } }) || 0;
    
    return {
        totalOrders,
        totalSpent
    };
};
