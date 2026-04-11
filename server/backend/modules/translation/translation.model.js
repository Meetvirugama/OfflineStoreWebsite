import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Translation = sequelize.define(
  "Translation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    original_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    target_lang: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    translated_text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: "translations",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["original_text", "target_lang"]
      }
    ]
  }
);

export default Translation;
