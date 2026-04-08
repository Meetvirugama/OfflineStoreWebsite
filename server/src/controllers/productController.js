import {
  createProductService,
  getLowStockService,
  getStockService,
  getProductsService,
  updateProductService
} from "../services/productService.js";


export const createProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "User missing in request"
            });
        }

        const productData = {
            ...req.body,
            created_by: req.user.id
        };

        const product = await createProductService(productData);

        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


export const getProducts = async (req, res) => {
  try {
    const data = await getProductsService();
    res.json(data);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = await updateProductService(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getStock = async (req, res) => {
  try {
    const stock = await getStockService(req.params.id);

    res.json({
      product_id: req.params.id,
      stock: stock || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const data = await getLowStockService();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};