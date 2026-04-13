import User from "./user/user.model.js";
import Customer from "./customer/customer.model.js";
import Product from "./product/product.model.js";
import Inventory from "./product/inventory.model.js";
import Supplier from "./product/supplier.model.js";
import Cart from "./cart/cart.model.js";
import CartItem from "./cart/cart_item.model.js";
import Order from "./order/order.model.js";
import OrderItem from "./order/order_item.model.js";
import Payment from "./payment/payment.model.js";
import Ledger from "./ledger/ledger.model.js";
import Notification from "./notification/notification.model.js";
import SavedCrop from "./crop/saved_crop.model.js";
import PestDetection from "./crop/pest_detection.model.js";
import Advisory from "./crop/advisory.model.js";
import WeatherCache from "./weather/weather.model.js";
import FarmerProfit from "./profit/profit.model.js";
import MandiPrice, { MandiCache, PriceCache } from "./mandi/mandi.model.js";
import PriceAlert from "./alert/alert.model.js";
import News from "./news/news.model.js";
import Chat from "./chat/chat.model.js";
import ChatMessage from "./chat/message.model.js";

// User - Customer
User.hasOne(Customer, { foreignKey: "user_id" });
Customer.belongsTo(User, { foreignKey: "user_id" });

// User - Agricultural Data
User.hasMany(SavedCrop, { foreignKey: "user_id" });
SavedCrop.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(FarmerProfit, { foreignKey: "user_id" });
FarmerProfit.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(PestDetection, { foreignKey: "user_id" });
PestDetection.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Advisory, { foreignKey: "user_id" });
Advisory.belongsTo(User, { foreignKey: "user_id" });

// Customer - Cart
Customer.hasOne(Cart, { foreignKey: "customer_id" });
Cart.belongsTo(Customer, { foreignKey: "customer_id" });

Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// Customer - Orders
Customer.hasMany(Order, { foreignKey: "customer_id" });
Order.belongsTo(Customer, { foreignKey: "customer_id" });

User.hasMany(Order, { foreignKey: "created_by" });
Order.belongsTo(User, { as: "creator", foreignKey: "created_by" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

// Orders - Payments
Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

User.hasMany(Payment, { foreignKey: "created_by" });
Payment.belongsTo(User, { as: "payer", foreignKey: "created_by" });

// Ledger
Customer.hasMany(Ledger, { foreignKey: "customer_id" });
Ledger.belongsTo(Customer, { foreignKey: "customer_id" });

// Alerts
User.hasMany(PriceAlert, { foreignKey: "user_id" });
PriceAlert.belongsTo(User, { foreignKey: "user_id" });

// Inventory & Products
Product.hasMany(Inventory, { foreignKey: "product_id" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

Supplier.hasMany(Product, { foreignKey: "supplier_id" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id" });

// Support Chat
User.hasMany(Chat, { foreignKey: "user_id" });
Chat.belongsTo(User, { foreignKey: "user_id" });

Chat.hasMany(ChatMessage, { foreignKey: "chat_id" });
ChatMessage.belongsTo(Chat, { foreignKey: "chat_id" });

User.hasMany(ChatMessage, { foreignKey: "sender_id" });
ChatMessage.belongsTo(User, { as: "sender", foreignKey: "sender_id" });

export {
  User,
  Customer,
  Product,
  Inventory,
  Supplier,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Ledger,
  Notification,
  SavedCrop,
  PestDetection,
  Advisory,
  WeatherCache,
  FarmerProfit,
  MandiPrice,
  MandiCache,
  PriceCache,
  PriceAlert,
  News,
  Chat,
  ChatMessage
};
