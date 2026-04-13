import express from "express";
import * as chatController from "./chat.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Farmer Routes
router.get("/my-chat", chatController.getMyChat);
router.post("/message", chatController.sendMessage);
router.get("/messages", chatController.getMessages);

// Admin Routes
router.get("/admin/all", restrictTo("ADMIN"), chatController.getAllChats);
router.get("/admin/messages/:chatId", restrictTo("ADMIN"), chatController.getAdminMessages);
router.post("/admin/reply", restrictTo("ADMIN"), chatController.sendAdminReply);

export default router;
