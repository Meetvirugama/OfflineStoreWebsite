import Ledger from "./ledger.model.js";

export const addEntry = async (data) => {
    const last = await Ledger.findOne({
        where: { user_id: data.user_id },
        order: [["created_at", "DESC"]]
    });

    const lastBalance = last ? last.balance_after : 0;
    const balance_after = data.type === "DEBIT" 
        ? lastBalance + data.amount 
        : lastBalance - data.amount;

    return await Ledger.create({ ...data, balance_after });
};

export const getUserLedger = async (userId) => {
    return await Ledger.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]]
    });
};
