import {
  createSupplierService,
  getSuppliersService,
  getSupplierByIdService,
  updateSupplierService,
  deleteSupplierService,
  getSupplierProductService,
  SupplierReportService,
  PurchaseHistoryService
} from "../services/supplierService.js";

// CREATE
export const createSupplier = async (req, res) => {
  try {
    const data = await createSupplierService(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
export const getSuppliers = async (req, res) => {
  try {
    const data = await getSuppliersService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
export const getSupplierById = async (req, res) => {
  try {
    const data = await getSupplierByIdService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const updateSupplier = async (req, res) => {
  try {
    const data = await updateSupplierService(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteSupplier = async (req, res) => {
  try {
    const data = await deleteSupplierService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSupplierProducts = async (req, res) => {
    const data = await getSupplierProductService(req.params.id);
    res.json(data);
};

export const supplierReport = async (req, res) => {
    const data = await SupplierReportService(req.params.id);
    res.json(data);
};

export const purchaseHistory = async (req, res) => {
    const data = await PurchaseHistoryService(req.params.id);
    res.json(data);
};