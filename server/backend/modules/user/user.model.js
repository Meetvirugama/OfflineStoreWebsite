import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  auth_provider: {
    type: DataTypes.ENUM("LOCAL", "GOOGLE"),
    defaultValue: "LOCAL"
  },
  role: {
    type: DataTypes.ENUM("ADMIN", "CUSTOMER"),
    defaultValue: "CUSTOMER"
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otp_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("otp_expiry");
      return rawValue ? new Date(rawValue) : null;
    }
  }
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  defaultScope: {
    attributes: { exclude: ["password"] }
  }
});

export default User;
