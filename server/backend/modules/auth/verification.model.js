import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const VerificationReq = sequelize.define("VerificationReq", {
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
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp_expiry: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "verification_reqs",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default VerificationReq;
