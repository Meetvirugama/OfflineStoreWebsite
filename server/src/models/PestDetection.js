import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PestDetection = sequelize.define("pest_detection", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    crop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    disease_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    solution: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    organic_solution: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    severity: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        defaultValue: "Low",
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "pest_detections",
    timestamps: false,
});

export default PestDetection;
