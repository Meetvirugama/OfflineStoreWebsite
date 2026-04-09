import express from "express";
import * as newsController from "./news.controller.js";

const router = express.Router();

router.get("/", newsController.getNews);
router.post("/sync", newsController.sync);

export default router;
