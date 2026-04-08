import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@core/api/client";
import "@/styles/Admin.css";
import useToastStore from "@core/hooks/useToast";

export default function SupplierDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                setLoading(true);
                const [suppRes, prodRes] = await Promise.all([
                    api.get(`/suppliers/${id}`),
                    api.get(`/suppliers/${id}/products`)
                ]);
                setSupplier(suppRes.data);
                setProducts(prodRes.data);
            } catch (err) {
                addToast("Failed to fetch supplier details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSupplierDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!supplier) return <div>Supplier not found.</div>;

    return (
        <div className="admin-page">
            <button onClick={() => navigate(-1)} className="btn-elite secondary" style={{ marginBottom: '20px' }}>&larr; Back to Network</button>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <h2 style={{color: '#0f172a', marginTop: 0}}>{supplier.name}</h2>
                <div style={{ display: 'flex', gap: '20px', color: '#475569', fontSize: '14px' }}>
                    <p style={{margin: 0}}><strong>Mobile:</strong> {supplier.mobile}</p>
                    <p style={{margin: 0}}><strong>System ID:</strong> #{supplier.id}</p>
                </div>
            </div>

            <div className="admin-actions-bar">
                <h3 style={{margin: 0}}>Supplier Products Vault</h3>
                <span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px', background: '#f8fafc', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    {products.length} Products Hosted
                </span>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price (₹)</th>
                        <th>Active Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No active products routing from this supplier.</td></tr>
                    ) : (
                        products.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600, color: '#64748b' }}>#{p.id}</td>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.category}</span></td>
                                <td>{p.brand}</td>
                                <td>₹{p.selling_price}</td>
                                <td>
                                    <span style={{ fontWeight: 'bold', color: p.stock > 10 ? '#059669' : '#e11d48' }}>
                                        {p.stock} Units
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
