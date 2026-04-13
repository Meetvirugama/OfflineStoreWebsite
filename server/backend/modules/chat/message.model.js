import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ChatMessage = sequelize.define("ChatMessage", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    chatId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "chat_id"
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "sender_id"
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "chat_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default ChatMessage;
