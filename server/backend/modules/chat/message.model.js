import { DataTypes } from \"sequelize\";
import sequelize from \"../../config/db.js\";

const ChatMessage = sequelize.define(\"ChatMessage\", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: \"chat_messages\",
    timestamps: true,
    createdAt: \"created_at\",
    updatedAt: false
});

export default ChatMessage;
