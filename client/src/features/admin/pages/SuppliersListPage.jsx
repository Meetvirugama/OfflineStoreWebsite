import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@core/api/client";
import "@/styles/Admin.css";
import useToastStore from "@core/hooks/useToast";
import AgroLoader from "@core/components/AgroLoader";

export default function SuppliersListPage() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", mobile: "" });

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/suppliers");
            // Handle standardized { success, message, data } response
            // res is already the body due to interceptor
            setSuppliers(res.data || res || []);
        } catch (err) {
            addToast("Failed to fetch suppliers", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/suppliers", createForm);
            addToast("Supplier created successfully", "success");
            setIsCreateOpen(false);
            setCreateForm({ name: "", mobile: "" });
            fetchSuppliers();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to create supplier", "error");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', width: '100%' }}>
            <AgroLoader text="Tracing supplier network..." />
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div style={{ borderLeft: '4px solid var(--admin-amber)', paddingLeft: '15px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Suppliers Management</h2>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Coordinate and track secondary market supply partners.</p>
                </div>
                <button className="btn-elite primary" onClick={() => setIsCreateOpen(true)}>+ New Supplier</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No suppliers registered in the network.</td></tr>
                    ) : (
                        suppliers.map(s => (
                            <tr key={s.id}>
                                <td style={{ fontWeight: 600, color: '#64748b' }}>#{s.id}</td>
                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                <td>{s.mobile}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                                            className="t-btn view"
                                        >View Details & Products</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Create Supplier Modal */}
            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Supplier</h3>
                        <form onSubmit={handleCreate} className="modal-form">
                            <input placeholder="Name" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} />
                            <input placeholder="Mobile Number" required value={createForm.mobile} onChange={e => setCreateForm({...createForm, mobile: e.target.value})} />
                            
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-elite primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
