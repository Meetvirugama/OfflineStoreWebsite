import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CropAdvisory = sequelize.define("crop_advisory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null for guest explorations, though UI will focus on logged-in users
    },
    crop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weather_data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    advisory: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    risk_level: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "LOW",
    },
    accuracy_meta: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
    },
    created_at: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "crop_advisory",
    timestamps: false,
});

export default CropAdvisory;
