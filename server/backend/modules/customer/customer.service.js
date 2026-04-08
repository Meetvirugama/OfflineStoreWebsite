import Customer from "./customer.model.js";

export const createCustomer = async (data) => {
    const existing = await Customer.findOne({ where: { mobile: data.mobile } });
    if (existing) throw new Error("Customer already exists");
    return await Customer.create(data);
};

export const getCustomers = async () => {
    return await Customer.findAll();
};

export const getCustomerById = async (id) => {
    return await Customer.findByPk(id);
};

export const updateCustomer = async (id, data) => {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");
    return await customer.update(data);
};

export const deleteCustomer = async (id) => {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");
    await customer.destroy();
    return { message: "Customer deleted" };
};

/**
 * Update financial balance for a customer
 */
export const updateFinancials = async (customerId, amount, type, transaction = null) => {
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) throw new Error("Customer not found");

    if (type === "DEBIT") {
        customer.total_purchase += amount;
        customer.total_due += amount;
    } else if (type === "CREDIT") {
        customer.total_paid += amount;
        customer.total_due -= amount;
    }

    customer.total_due = Math.max(0, customer.total_due);
    customer.tag = customer.total_due === 0 ? "SAFE" : "ACTIVE";
    
    await customer.save({ transaction });
};
