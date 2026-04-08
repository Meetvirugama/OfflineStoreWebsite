import express from "express";
import * as newsController from "../controllers/newsController.js";

const router = express.Router();

router.get("/", newsController.getNews);
router.post("/sync", newsController.syncNews); // Manual sync trigger for admins

export default router;
