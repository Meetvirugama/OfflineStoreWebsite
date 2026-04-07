import Customer from "../models/Customer.js";

/* =========================
   CREATE CUSTOMER
========================= */
export const createCustomerService = async (data) => {
    const existing = await Customer.findOne({
        where: { mobile: data.mobile }
    });

    if (existing) {
        throw new Error("Customer already exists");
    }

    return await Customer.create(data);
};

/* =========================
   GET ALL CUSTOMERS
========================= */
export const getCustomersService = async () => {
    return await Customer.findAll();
};

/* =========================
   GET SINGLE CUSTOMER
========================= */
export const getCustomerByIdService = async (id) => {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");
    return customer;
};

/* =========================
   UPDATE CUSTOMER
========================= */
export const updateCustomerService = async (id, data) => {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    return await customer.update(data);
};

/* =========================
   DELETE CUSTOMER
========================= */
export const deleteCustomerService = async (id) => {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    await customer.destroy();
    return { message: "Customer deleted" };
};

export const updateCustomerFinancials = async (
    customerId,
    amount,
    type,
    transaction = null
) => {
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) throw new Error("Customer not found");

    customer.total_purchase = Number(customer.total_purchase || 0);
    customer.total_paid = Number(customer.total_paid || 0);
    customer.total_due = Number(customer.total_due || 0);

    if (type === "CREDIT" && amount > customer.total_due) {
        amount = customer.total_due;
    }

    if (type === "DEBIT") {
        customer.total_purchase += amount;
        customer.total_due += amount;
    } else if (type === "CREDIT") {
        customer.total_paid += amount;
        customer.total_due -= amount;
    } else {
        throw new Error("Invalid transaction type");
    }

    if (customer.total_due < 0) {
        customer.total_due = 0;
    }

    const round = (val) => Math.round(val * 100) / 100;
    customer.total_purchase = round(customer.total_purchase);
    customer.total_paid = round(customer.total_paid);
    customer.total_due = round(customer.total_due);

    // Tagging logic is now simplified (no credit limit constraints)
    customer.tag = customer.total_due === 0 ? "SAFE" : "ACTIVE";
    customer.credit_score = 100; // Defaulting to 100 as credit checks are removed

    await customer.save({ transaction });
};