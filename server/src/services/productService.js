import  Product from "../models/Product.js";
import { Inventory } from "../models/Inventory.js";
import { Supplier } from "../models/Supplier.js";

// CREATE PRODUCT
export const createProductService = async (data) => {
  const {
    name,
    category,
    brand,
    mrp,
    selling_price,
    batch_number,
    expiry_date,
    supplier_id,
    quantity,
    created_by,
  } = data;

  // ✅ Supplier validation
  const supplier = await Supplier.findByPk(supplier_id);
  if (!supplier) throw new Error("Supplier Not Found");

  // ✅ Check duplicate
  const existing = await Product.findOne({
    where: { name, brand, category },
  });

  // 🔥 If exists → increase stock
  if (existing) {
    await Inventory.create({
      product_id: existing.id,
      quantity_change: quantity || 0,
      type: "IN",
      reference_type: "PURCHASE",
    });

    return { message: "Stock updated for existing product" };
  }

  // ✅ Create product
  const product = await Product.create({
    name,
    category,
    brand,
    mrp,
    selling_price,
    batch_number,
    expiry_date,
    supplier_id,
    created_by,
  });

  // ✅ Add stock
  if (quantity) {
    await Inventory.create({
      product_id: product.id,
      quantity_change: quantity,
      type: "IN",
      reference_type: "PURCHASE",
    });
  }


  return product;
};


export const getProductsService = async () => {
  const products = await Product.findAll({
    include: [
      {
        model: Supplier,
        attributes: ["id", "name"]
      }
    ]
  });

  const result = [];

  for (let p of products) {
    const stock = await Inventory.sum("quantity_change", {
      where: { product_id: p.id }
    });

    result.push({
      ...p.toJSON(),
      stock: stock || 0
    });
  }

  return result;
};

export const updateProductService = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product Not Found");
  return await product.update(data);
};

// GET STOCK
export const getStockService = async (product_id) => {
  const stock = await Inventory.sum("quantity_change", {
    where: { product_id },
  });
  return stock || 0;
};

// LOW STOCK
export const getLowStockService = async () => {
  const products = await Product.findAll();
  const result = [];

  for (let p of products) {
    const stock = await Inventory.sum("quantity_change", {
      where: { product_id: p.id },
    });

    if ((stock || 0) < 10) {
      result.push({ ...p.toJSON(), stock });
    }
  }

  return result;
};