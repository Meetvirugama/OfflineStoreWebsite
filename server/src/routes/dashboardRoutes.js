    import express from "express";
    import { getDashboard } from "../controllers/dashboardController.js";

    import { authMiddleware } from "../middlewares/authMiddleware.js";
    import { allowRoles } from "../middlewares/roleMiddleware.js";

    const router = express.Router();

    router.get("/",
        authMiddleware,
        allowRoles("ADMIN"),
        getDashboard
    );

    export default router;