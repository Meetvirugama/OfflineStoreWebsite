import bcrypt from "bcryptjs";
import { 
    sequelize, 
    User, 
    Customer, 
    Product, 
    Orders, 
    OrderItem, 
    Payment, 
    Inventory, 
    Ledger 
} from "../models/index.js";

async function deepSeed() {
    console.log("🚀 Starting Deep Seeding of demo data...");

    try {
        const adminUser = await User.findOne({ where: { role: 'ADMIN' } });
        if (!adminUser) throw new Error("❌ No Admin found for 'created_by' fields.");

        const products = await Product.findAll();
        if (products.length === 0) throw new Error("❌ No Products found. Please run reset_db.js first.");

        const password = await bcrypt.hash("demo123", 10);

        const customerData = [
            { name: "Ramesh Kumar", email: "ramesh@farmer.com", mobile: "9876543210", village: "Pipaliya", tag: "PLATINUM" },
            { name: "Anita Singh", email: "anita@agri.com", mobile: "8765432109", village: "Gondal", tag: "REGULAR" },
            { name: "Suresh Bhai", email: "suresh@village.com", mobile: "7654321098", village: "Rajkot", tag: "NEW" },
            { name: "Deepak Verma", email: "deepak@morbi.com", mobile: "6543210987", village: "Morbi", tag: "DUE" }
        ];

        for (const c of customerData) {
            console.log(`👤 Creating Customer: ${c.name}...`);
            
            const user = await User.create({
                name: c.name,
                email: c.email,
                password: password,
                role: 'CUSTOMER',
                is_verified: true
            });

            const customer = await Customer.create({
                user_id: user.id,
                name: c.name,
                email: c.email,
                mobile: c.mobile,
                village: c.village,
                tag: c.tag
            });

            // GENERATE 2-3 ORDERS PER CUSTOMER
            const orderCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < orderCount; i++) {
                const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
                
                let total = 0;
                const itemsToCreate = [];

                for (const p of randomProducts) {
                    const qty = Math.floor(Math.random() * 5) + 1;
                    const itemTotal = p.selling_price * qty;
                    total += itemTotal;
                    itemsToCreate.push({
                        product_id: p.id,
                        quantity: qty,
                        price: p.selling_price,
                        total: itemTotal
                    });
                }

                const gst = total * 0.18;
                const final = total + gst;
                const invoice = `INV-${Date.now()}-${Math.floor(Math.random()*1000)}`;

                const orderStatus = ['PAID', 'PARTIAL', 'PENDING'][Math.floor(Math.random() * 3)];
                let paid = 0;
                if (orderStatus === 'PAID') paid = final;
                if (orderStatus === 'PARTIAL') paid = final / 2;

                const order = await Orders.create({
                    customer_id: customer.id,
                    total_amount: total,
                    gst_total: gst,
                    final_amount: final,
                    paid_amount: paid,
                    invoice_number: invoice,
                    status: orderStatus,
                    created_by: adminUser.id
                });

                for (const item of itemsToCreate) {
                    await OrderItem.create({ ...item, order_id: order.id });
                    
                    // UPDATE STOCK & INVENTORY
                    const prod = await Product.findByPk(item.product_id);
                    await prod.decrement('stock', { by: item.quantity });
                    
                    await Inventory.create({
                        product_id: item.product_id,
                        quantity_change: -item.quantity,
                        type: 'OUT',
                        reference_type: 'ORDER',
                        reference_id: order.id
                    });
                }

                // PAYMENTS
                if (paid > 0) {
                    await Payment.create({
                        order_id: order.id,
                        amount: paid,
                        payment_mode: 'CASH',
                        reference_no: `DEMO-PAY-${order.id}`,
                        created_by: adminUser.id
                    });
                }

                // UPDATE CUSTOMER TOTALS
                await customer.increment('total_purchase', { by: final });
                await customer.increment('total_paid', { by: paid });
                await customer.increment('total_due', { by: final - paid });

                // LEDGER
                await Ledger.create({
                    customer_id: customer.id,
                    amount: final,
                    type: 'DEBIT',
                    description: `Order ${invoice}`
                });

                if (paid > 0) {
                    await Ledger.create({
                        customer_id: customer.id,
                        amount: paid,
                        type: 'CREDIT',
                        description: `Payment for ${invoice}`
                    });
                }
            }
        }

        console.log("✅ Deep Seeding successfully completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ ERROR during Deep Seeding:", err);
        process.exit(1);
    }
}

deepSeed();
