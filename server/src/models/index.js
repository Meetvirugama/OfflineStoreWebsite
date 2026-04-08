import sequelize from "../config/db.js";

// CORE MODELS
import Customer from "./Customer.js";
import { Supplier } from "./Supplier.js";
import Product from "./Product.js";
import { Inventory } from "./Inventory.js";
import Orders from "./Orders.js";
import { OrderItem } from "./OrderItem.js";
import Payment from "./Payment.js";
import Ledger from "./Ledger.js";
import { Cart } from "./Cart.js";
import { CartItem } from "./CartItem.js";
import { PurchaseItem } from "./PurchaseItem.js";
import User from "./User.js";
import { Notification } from "./Notification.js";
import MandiPrice from "./MandiPrice.js";
import Crop from "./Crop.js";



// =========================
// CUSTOMER RELATIONS
// =========================

User.hasOne(Customer, { foreignKey: "user_id" });
Customer.belongsTo(User, { foreignKey: "user_id" });

Customer.hasMany(Orders, { foreignKey: "customer_id" });
Orders.belongsTo(Customer, { foreignKey: "customer_id" });

Customer.hasMany(Ledger, { foreignKey: "customer_id" });
Ledger.belongsTo(Customer, { foreignKey: "customer_id" });

Customer.hasMany(Cart, { foreignKey: "customer_id" });
Cart.belongsTo(Customer, { foreignKey: "customer_id" });


// =========================
// USER RELATIONS
// =========================
User.hasMany(Orders, { foreignKey: "created_by" });
Orders.belongsTo(User, { foreignKey: "created_by" });



// =========================
// SUPPLIER → PRODUCT
// =========================
Supplier.hasMany(Product, { foreignKey: "supplier_id" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id" });



// =========================
// PRODUCT RELATIONS
// =========================
Product.hasMany(Inventory, { foreignKey: "product_id" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(PurchaseItem, { foreignKey: "product_id" });
PurchaseItem.belongsTo(Product, { foreignKey: "product_id" });


// =========================
// ORDER RELATIONS
// =========================
Orders.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Orders, { foreignKey: "order_id" });

Orders.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Orders, { foreignKey: "order_id" });


// =========================
// CART RELATIONS
// =========================
Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });







// =========================
// EXPORT
// =========================
export {
    sequelize,
    Customer,
    Supplier,
    Product,
    Inventory,
    Orders,
    OrderItem,
    Payment,
    Ledger,
    Cart,
    CartItem,
    PurchaseItem,
    User,
    Notification,
    MandiPrice,
    Crop
};
