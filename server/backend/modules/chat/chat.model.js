import { DataTypes } from \"sequelize\";
import sequelize from \"../../config/db.js\";

const Chat = sequelize.define(\"Chat\", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(\"OPEN\", \"CLOSED\"),
        defaultValue: \"OPEN\"
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: \"chats\",
    timestamps: true,
    createdAt: \"created_at\",
    updatedAt: \"updated_at\"
});

export default Chat;
