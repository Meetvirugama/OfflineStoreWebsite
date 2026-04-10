import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Advisory = sequelize.define("Advisory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    crop: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weather_data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    risk_level: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "LOW"
    },
    advisory: {
        type: DataTypes.JSON, // Array of {title, message, icon}
        allowNull: false
    },
    accuracy_meta: {
        type: DataTypes.JSON,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "advisories",
    timestamps: false
});

export default Advisory;
