import sequelize from "../server/src/config/db.js";
import { orderEvent } from "../server/src/services/notificationService.js";
import { Orders } from "../server/src/models/index.js";

async function test() {
  try {
    console.log("🔍 Fetching a sample order...");
    const order = await Orders.findOne({ order: [['id', 'DESC']] });
    
    if (!order) {
      console.error("❌ No orders found in database!");
      return;
    }

    console.log(`✅ Found Order #${order.id} (Customer ID: ${order.customer_id})`);
    
    // 🔥 DEBUG ENVIRONMENT
    console.log("🔍 Checking Node Process Environment:");
    console.log("   - EMAIL:", process.env.EMAIL);
    console.log("   - PASS_LEN:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    console.log("📡 Triggering orderEvent (calling notification system)...");
    
    await orderEvent(order);
    
    console.log("🏁 Notification process execution completed. Check your inbox!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

test();
