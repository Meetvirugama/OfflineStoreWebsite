import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const PestDetection = sequelize.define('PestDetection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    crop: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    disease: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    confidence: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    treatment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ai_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'pest_detections_v2', // Using v2 to avoid collision with existing legacy table if any
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default PestDetection;
