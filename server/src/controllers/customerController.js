import {
    createCustomerService,
    getCustomersService,
    getCustomerByIdService,
    updateCustomerService,
    deleteCustomerService
} from "../services/customerService.js";

export const createCustomer = async (req, res) => {
    try {
        const data = await createCustomerService(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getCustomers = async (req, res) => {
    const data = await getCustomersService();
    res.json(data);
};

export const getCustomer = async (req, res) => {
    try {
        const data = await getCustomerByIdService(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const data = await updateCustomerService(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const data = await deleteCustomerService(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};