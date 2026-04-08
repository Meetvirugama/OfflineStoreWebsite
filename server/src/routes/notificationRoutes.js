import express from "express";
import {
    getAll,
    run,
    analytics,
    open,
    click,
    remind,
    remove
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAll);
router.get("/run", run);
router.get("/analytics", analytics);

router.put("/:id/open", open);
router.put("/:id/click", click);
router.delete("/:id", remove);
router.post("/remind/:orderId", authMiddleware, allowRoles("ADMIN", "STAFF"), remind);

export default router;