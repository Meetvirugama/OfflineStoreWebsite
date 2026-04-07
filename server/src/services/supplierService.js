import { Inventory } from "../models/Inventory.js";
import  Product  from "../models/Product.js";
import { Supplier } from "../models/Supplier.js";

// CREATE
export const createSupplierService = async (data) => {
  const { name, mobile } = data;

  if (!name) {
    throw new Error("Name is required");
  }

  // duplicate check
  if (mobile) {
    const existing = await Supplier.findOne({ where: { mobile } });
    if (existing) {
      throw new Error("Supplier already exists with this mobile");
    }
  }

  return await Supplier.create({ name, mobile });
};

// GET ALL
export const getSuppliersService = async () => {
  return await Supplier.findAll();
};

// GET BY ID
export const getSupplierByIdService = async (id) => {
  const supplier = await Supplier.findByPk(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

// UPDATE
export const updateSupplierService = async (id, data) => {
  const supplier = await Supplier.findByPk(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplier.update(data);
  return supplier;
};

// DELETE
export const deleteSupplierService = async (id) => {
  const supplier = await Supplier.findByPk(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplier.destroy();
  return { message: "Supplier deleted successfully" };
};

export const getSupplierProductService = async (supplierId) => {
    return await Product.findAll({where : {supplier_id : supplierId}});
};

export const SupplierReportService = async (supplierId) => {
    return await Product.findAll({where : {supplier_id : supplierId} , attributes : ["id" , "name" , "category" , "brand" , "selling_price"]});
};

export const PurchaseHistoryService = async (supplierId) => {
    return await Inventory.findAll({
        include : [
            {
                model : Product,
                where : {supplier_id : supplierId}
            }
        ],
        where : {type : "IN"}
    });
};