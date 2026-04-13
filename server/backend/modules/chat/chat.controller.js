import { Chat, ChatMessage, User } from "../index.js";
import { asyncHandler } from "../../utils/errorHandler.js";

// Get or create chat session for current user (Farmer)
export const getMyChat = asyncHandler(async (req, res) => {
    let chat = await Chat.findOne({ 
        where: { userId: req.user.id },
        include: [{ model: ChatMessage, limit: 1, order: [['createdAt', 'DESC']] }]
    });

    if (!chat) {
        chat = await Chat.create({ userId: req.user.id });
    }

    res.status(200).json({ status: "success", data: chat });
});

// Send message from Farmer
export const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    let chat = await Chat.findOne({ where: { userId: req.user.id } });

    if (!chat) {
        chat = await Chat.create({ userId: req.user.id });
    }

    const message = await ChatMessage.create({
        chatId: chat.id,
        senderId: req.user.id,
        text
    });

    res.status(201).json({ status: "success", data: message });
});

// Get message history for Farmer
export const getMessages = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ where: { userId: req.user.id } });
    if (!chat) return res.status(200).json({ status: "success", data: [] });

    const messages = await ChatMessage.findAll({
        where: { chatId: chat.id },
        order: [['createdAt', 'ASC']]
    });

    res.status(200).json({ status: "success", data: messages });
});

// -- Admin Controllers --

// Get all active chats for Support Dashboard
export const getAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.findAll({
        include: [
            { model: User, attributes: ['id', 'name', 'phone'] },
            { model: ChatMessage, limit: 1, order: [['createdAt', 'DESC']] }
        ],
        order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ status: "success", data: chats });
});

// Get specific chat messages for Admin
export const getAdminMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await ChatMessage.findAll({
        where: { chatId },
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
        order: [['createdAt', 'ASC']]
    });

    res.status(200).json({ status: "success", data: messages });
});

// Send reply from Admin
export const sendAdminReply = asyncHandler(async (req, res) => {
    const { chatId, text } = req.body;
    
    const message = await ChatMessage.create({
        chatId,
        senderId: req.user.id,
        text
    });

    // Update chat timestamp for sorting
    await Chat.update({ updatedAt: new Date() }, { where: { id: chatId } });

    res.status(201).json({ status: "success", data: message });
});
