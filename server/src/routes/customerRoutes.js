import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/",
  authMiddleware,
  allowRoles("ADMIN"),
  createCustomer
);

router.get("/",
  authMiddleware,
  allowRoles("ADMIN"),
  getCustomers
);

router.get("/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  getCustomer
);

router.put("/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  updateCustomer
);

router.delete("/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  deleteCustomer
);

export default router;