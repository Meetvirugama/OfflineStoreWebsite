import MandiPrice from "../mandi/mandi.model.js";
import { Op } from "sequelize";

export const getComparison = async (commodity, markets) => {
    return await MandiPrice.findAll({
        where: {
            commodity,
            market: { [Op.in]: markets }
        },
        order: [["arrival_date", "DESC"]],
        limit: 10
    });
};

export const getHistory = async (commodity, district) => {
    return await MandiPrice.findAll({
        where: { commodity, district },
        order: [["arrival_date", "DESC"]],
        limit: 30
    });
};
