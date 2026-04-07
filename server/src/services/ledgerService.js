import Ledger from "../models/Ledger.js";

const getLastBalance = async (customer_id) => {
    const last = await Ledger.findOne({
        where: { customer_id },
        order: [["id", "DESC"]]
    });

    return last ? Number(last.balance) : 0;
};

export const addLedgerEntry = async ({
    customer_id,
    type,
    amount,
    reference_type,
    reference_id,
    description
}) => {
    const lastBalance = await getLastBalance(customer_id);

    let newBalance =
        type === "DEBIT"
            ? lastBalance + amount
            : lastBalance - amount;

    return await Ledger.create({
        customer_id,
        type,
        amount,
        balance: newBalance,
        reference_type,
        reference_id,
        description
    });
};

export const getCustomerLedgerService = async (customer_id) => {
    return await Ledger.findAll({
        where: { customer_id },
        order: [["id", "ASC"]]
    });
};