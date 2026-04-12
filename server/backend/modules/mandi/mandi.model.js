import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const MandiPrice = sequelize.define("MandiPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    market: { type: DataTypes.STRING, allowNull: false },
    commodity: { type: DataTypes.STRING, allowNull: false },
    min_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    max_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    modal_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    arrival_date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
    tableName: "mandi_prices",
    timestamps: false
});

/**
 * MANDI_CACHE: Stores static/discovered location of mandis
 */
const MandiCache = sequelize.define("MandiCache", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    lat: { type: DataTypes.DOUBLE, allowNull: false },
    lng: { type: DataTypes.DOUBLE, allowNull: false },
    last_updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "mandi_cache",
    timestamps: false
});

/**
 * PRICE_CACHE: Stores daily modal prices
 */
const PriceCache = sequelize.define("PriceCache", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    mandi_name: { type: DataTypes.STRING, allowNull: false },
    commodity: { type: DataTypes.STRING, allowNull: false },
    min_price: { type: DataTypes.FLOAT },
    max_price: { type: DataTypes.FLOAT },
    modal_price: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
    tableName: "price_cache",
    timestamps: false
});

export { MandiPrice, MandiCache, PriceCache };
export default MandiPrice;
