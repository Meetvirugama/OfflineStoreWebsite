import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id"
    },
    status: {
        type: DataTypes.ENUM("OPEN", "CLOSED"),
        defaultValue: "OPEN"
    }
}, {
    tableName: "chats",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Chat;
