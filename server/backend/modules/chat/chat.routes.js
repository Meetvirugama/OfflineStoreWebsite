import express from \"express\";
import * as chatController from \"./chat.controller.js\";
import { protect, restrictTo } from \"../../middleware/auth.middleware.js\";

const router = express.Router();

router.use(protect);

router.get(\"/my-chat\", chatController.getMyChat);
router.post(\"/message\", chatController.sendMessage);
router.get(\"/messages/:id\", chatController.getMessages);

// Admin Routes
router.get(\"/admin/all\", restrictTo(\"ADMIN\"), chatController.getAllChats);

export default router;
