import { Chat, ChatMessage, User } from \"../index.js\";
import { sendResponse } from \"../../utils/response.js\";
import { asyncHandler } from \"../../utils/errorHandler.js\";

/**
 * Get or Create a chat session for the current user (Farmer)
 */
export const getMyChat = asyncHandler(async (req, res) => {
    let chat = await Chat.findOne({
        where: { user_id: req.user.id },
        include: [{ model: ChatMessage, limit: 50, order: [['created_at', 'ASC']] }]
    });

    if (!chat) {
        chat = await Chat.create({ user_id: req.user.id });
    }

    sendResponse(res, 200, \"Chat context retrieved\", chat);
});

/**
 * Send a message in a chat session
 */
export const sendMessage = asyncHandler(async (req, res) => {
    const { chat_id, text } = req.body;
    
    // Verify chat ownership
    const chat = await Chat.findByPk(chat_id);
    if (!chat) throw new Error(\"Chat session not found\");
    
    // Allow if user is owner OR admin
    if (chat.user_id !== req.user.id && req.user.role !== \"ADMIN\") {
        throw new Error(\"Unauthorized chat interaction\");
    }

    const message = await ChatMessage.create({
        chat_id,
        sender_id: req.user.id,
        text
    });

    sendResponse(res, 201, \"Message relayed\", message);
});

/**
 * [ADMIN] Get all active chats
 */
export const getAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.findAll({
        include: [
            { model: User, attributes: ['name', 'email'] },
            { model: ChatMessage, limit: 1, order: [['created_at', 'DESC']] }
        ]
    });
    sendResponse(res, 200, \"Global chat sessions retrieved\", chats);
});

/**
 * Get messages for a specific chat
 */
export const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const messages = await ChatMessage.findAll({
        where: { chat_id: id },
        order: [['created_at', 'ASC']],
        include: [{ model: User, as: 'sender', attributes: ['name', 'role'] }]
    });
    sendResponse(res, 200, \"Message history retrieved\", messages);
});
