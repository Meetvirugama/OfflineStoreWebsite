import { 
    sequelize, 
    User, 
    Product, 
    Supplier, 
    Inventory, 
    Customer, 
    Cart, 
    CartItem, 
    Orders, 
    OrderItem, 
    Payment, 
    Ledger, 
    Notification, 
    PurchaseItem
} from "../models/index.js";

async function resetAndSeed() {
    console.log("🚀 Starting database surgical reset (Postgres Mode)...");

    try {
        // 1. DISABLE CONSTRAINTS
        await sequelize.query("SET session_replication_role = 'replica';");

        // 2. CLEANUP TABLES IN ORDER
        const tablesToClear = [
            'Payment', 'OrderItem', 'Orders', 
            'Ledger', 'CartItem', 'Cart', 'PurchaseItem', 'Inventory', 
            'Product', 'Supplier', 'notification', 'Customer'
        ];

        for (const modelName of tablesToClear) {
            const model = sequelize.models[modelName];
            if (model) {
                console.log(`🗑️ Truncating ${modelName}...`);
                await sequelize.query(`TRUNCATE TABLE "${model.tableName}" RESTART IDENTITY CASCADE;`);
            } else {
                // Try manual table names if model lookup fails
                const tableName = modelName.toLowerCase();
                console.log(`🗑️ Manual truncate for table ${tableName}...`);
                try {
                    await sequelize.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
                } catch (e) {
                    console.warn(`⚠️ Warning: Could not truncate ${tableName}: ${e.message}`);
                }
            }
        }

        // 3. DELETE NON-ADMIN USERS
        const deletedUsers = await User.destroy({
            where: { role: 'CUSTOMER' }
        });
        console.log(`👥 Deleted ${deletedUsers} non-admin users.`);

        // 4. ENABLE CONSTRAINTS
        await sequelize.query("SET session_replication_role = 'origin';");

        // 5. SEED DATA
        console.log("🌱 Seeding fresh professional data...");

        const adminUser = await User.findOne({ where: { role: 'ADMIN' } });
        if (!adminUser) {
            throw new Error("❌ Fatal: No ADMIN user found. Please create an admin first.");
        }
        console.log(`👤 Using Admin: ${adminUser.name} (${adminUser.email})`);

        // Create Official Supplier
        const supplier = await Supplier.create({
            name: "AgroMart Official Global Sourcing",
            mobile: "9988776655"
        });

        const products = [
            // FERTILIZERS
            {
                name: "Organic NPK 19-19-19 Liquid",
                category: "Fertilizers",
                brand: "AgroPremium",
                mrp: 850,
                selling_price: 649,
                cost_price: 450,
                unit: "1 Litre",
                stock: 500,
                image: "https://images.unsplash.com/photo-1592982537447-6f2bf37a5f82?w=400&auto=format&fit=crop",
                description: "High-concentration balanced fertilizer for all types of crops. Enhances growth and root development.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            },
            {
                name: "Urea White Gold Granules",
                category: "Fertilizers",
                brand: "AgroPremium",
                mrp: 450,
                selling_price: 399,
                cost_price: 300,
                unit: "50 KG Bag",
                stock: 200,
                image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&auto=format&fit=crop",
                description: "High-grade nitrogen fertilizer for green vegetative growth and leaf development.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            },
            // SEEDS
            {
                name: "Hybrid Tomato F1 Ruby",
                category: "Seeds",
                brand: "EliteHarvest",
                mrp: 250,
                selling_price: 199,
                cost_price: 120,
                unit: "10gm Packet",
                stock: 1000,
                image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop",
                description: "Vibrant red, disease-resistant hybrid tomato. Fast-maturing and high shelf-life.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            },
            {
                name: "Premium Wheat High-Yield Gold",
                category: "Seeds",
                brand: "EliteHarvest",
                mrp: 1200,
                selling_price: 950,
                cost_price: 700,
                unit: "40 KG Bag",
                stock: 150,
                image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
                description: "Climate-resilient wheat seeds for bumper harvest. High protein content.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            },
            // PESTICIDES
            {
                name: "Neem Oil Bio-Shield 3000PPM",
                category: "Pesticides",
                brand: "GreenGuard",
                mrp: 550,
                selling_price: 449,
                cost_price: 320,
                unit: "500 ML",
                stock: 300,
                image: "https://images.unsplash.com/photo-1628352081506-83c43143df6b?w=400&auto=format&fit=crop",
                description: "100% natural cold-pressed neem oil. Effectively controls over 200 types of pests.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            },
            {
                name: "Fungicide Green Guard Pro",
                category: "Pesticides",
                brand: "GreenGuard",
                mrp: 890,
                selling_price: 749,
                cost_price: 550,
                unit: "250gm Packet",
                stock: 450,
                image: "https://images.unsplash.com/photo-1512148764024-5a67c4164b7f?w=400&auto=format&fit=crop",
                description: "Systemic fungicide for treating soil-borne and foliar diseases in vegetables.",
                supplier_id: supplier.id,
                created_by: adminUser.id
            }
        ];

        for (const prod of products) {
            const p = await Product.create(prod);
            await Inventory.create({
                product_id: p.id,
                quantity_change: prod.stock,
                type: 'IN',
                reference_type: 'INITIAL_STOCK',
                reference_id: p.id
            });
        }

        console.log(`✅ Success! Seeded ${products.length} professional products.`);
        process.exit(0);

    } catch (err) {
        console.error("❌ ERROR during reset:", err);
        process.exit(1);
    }
}

resetAndSeed();
