import FarmerProfit from "./profit.model.js";

export const logProfit = async (userId, data) => {
    const profit = parseFloat(data.revenue) - parseFloat(data.investment);
    return await FarmerProfit.create({
        ...data,
        user_id: userId,
        profit
    });
};

export const getStats = async (userId) => {
    const records = await FarmerProfit.findAll({ where: { user_id: userId } });
    
    const totalRevenue = records.reduce((acc, r) => acc + r.revenue, 0);
    const totalInvestment = records.reduce((acc, r) => acc + r.investment, 0);
    
    return {
        totalRevenue,
        totalInvestment,
        netProfit: totalRevenue - totalInvestment,
        history: records
    };
};
