import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserLocation = sequelize.define("UserLocation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  lon: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  village: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  }
}, {
  tableName: "user_locations",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default UserLocation;
