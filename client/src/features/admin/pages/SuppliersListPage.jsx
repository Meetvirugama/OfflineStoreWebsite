import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@core/api/client";
import "@/styles/Admin.css";
import useToastStore from "@core/hooks/useToast";
import AgroLoader from "@core/components/AgroLoader";
import Modal from "@core/components/Modal";
import DynText from '@core/i18n/DynText';

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
            setSuppliers(Array.isArray(res) ? res : []);
        } catch (err) {
            addToast(<DynText text="Failed to fetch suppliers" />, "error");
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
            addToast(<DynText text="Supplier created successfully" />, "success");
            setIsCreateOpen(false);
            setCreateForm({ name: "", mobile: "" });
            fetchSuppliers();
        } catch (err) {
            addToast(<DynText text={err.response?.data?.message || "Failed to create supplier"} />, "error");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', width: '100%' }}>
            <AgroLoader text={<DynText text="Tracing supplier network..." />} />
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div style={{ borderLeft: '4px solid var(--admin-amber)', paddingLeft: '15px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}><DynText text="Suppliers Management" /></h2>
                    <p style={{ fontSize: '13px', color: '#64748b' }}><DynText text="Coordinate and track secondary market supply partners." /></p>
                </div>
                <button className="btn-elite primary" onClick={() => setIsCreateOpen(true)}><DynText text="+ New Supplier" /></button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th><DynText text="ID" /></th>
                        <th><DynText text="Name" /></th>
                        <th><DynText text="Mobile" /></th>
                        <th><DynText text="Actions" /></th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}><DynText text="No suppliers registered in the network." /></td></tr>
                    ) : (
                        suppliers.map(s => (
                            <tr key={s.id}>
                                <td style={{ fontWeight: 600, color: '#64748b' }}>#{s.id}</td>
                                <td style={{ fontWeight: 600 }}><DynText text={s.name} /></td>
                                <td>{s.mobile}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                                            className="t-btn view"
                                        ><DynText text="View Details & Products" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Create Supplier Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onConfirm={handleCreate}
                title={<DynText text="Register New Strategic Partner" />}
                confirmText={<DynText text="Create Connection" />}
            >
                <div className="elite-form">
                    <div className="elite-form-group">
                        <label><DynText text="Partner Identity / Name" /></label>
                        <input className="elite-input" placeholder={t('admin.supplierNamePlaceholder') || "Supplier Name"} required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} />
                    </div>
                    <div className="elite-form-group">
                        <label><DynText text="Secure Mobile Contact" /></label>
                        <input className="elite-input" placeholder="+91 XXXX XXXX" required value={createForm.mobile} onChange={e => setCreateForm({...createForm, mobile: e.target.value})} />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
