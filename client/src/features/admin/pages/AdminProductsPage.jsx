import { useState, useEffect } from "react";
import api from "@core/api/client";
import "@/styles/Admin.css"; // Basic minimal styles
import useToastStore from "@core/hooks/useToast";
import AgroLoader from "@core/components/AgroLoader";
import Modal from "@core/components/Modal";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAdjustOpen, setIsAdjustOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form states
    const [createForm, setCreateForm] = useState({
        name: "", category: "", brand: "", mrp: "", selling_price: "", image: "", stock: "", supplier_id: "1"
    });
    
    // Adjust stock state
    const [adjustForm, setAdjustForm] = useState({ quantity: "", type: "IN", reference_type: "MANUAL" });

    const [editForm, setEditForm] = useState({
        name: "", category: "", brand: "", mrp: "", selling_price: "", image: ""
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            addToast("Failed to fetch products", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/products", {
                ...createForm,
                mrp: Number(createForm.mrp),
                selling_price: Number(createForm.selling_price),
                stock: Number(createForm.stock),
                supplier_id: Number(createForm.supplier_id)
            });
            addToast("Product created successfully", "success");
            setIsCreateOpen(false);
            setCreateForm({ name: "", category: "", brand: "", mrp: "", selling_price: "", image: "", stock: "", supplier_id: "1" });
            fetchProducts();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to create product", "error");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${selectedProduct.id}`, {
                ...editForm,
                mrp: Number(editForm.mrp),
                selling_price: Number(editForm.selling_price)
            });
            addToast("Product updated successfully", "success");
            setIsEditOpen(false);
            fetchProducts();
        } catch (err) {
            addToast(err.response?.data?.message || "Update failed", "error");
        }
    };

    const handleAdjust = async (e) => {
        e.preventDefault();
        try {
            await api.post("/inventory/adjust", {
                product_id: selectedProduct.id,
                quantity: Number(adjustForm.quantity),
                type: adjustForm.type,
                reference_type: adjustForm.reference_type
            });
            addToast("Stock updated successfully", "success");
            setIsAdjustOpen(false);
            setAdjustForm({ quantity: "", type: "IN", reference_type: "MANUAL" });
            fetchProducts();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to adjust stock", "error");
        }
    };

    if (loading) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', width: '100%' }}>
        <AgroLoader text="Fetching nature's inventory..." />
      </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <h2>Product & Inventory Hub</h2>
                <button className="btn-elite primary" onClick={() => setIsCreateOpen(true)}>+ Add New Product</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Preview</th>
                        <th>System Name</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Active Stock</th>
                        <th>Quick Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td style={{ fontWeight: 600, color: '#64748b' }}>#{p.id}</td>
                            <td>
                                <img src={p.image || "https://placehold.co/40"} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                            </td>
                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                            <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.category}</span></td>
                            <td>₹{p.selling_price}</td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontWeight: 'bold', color: p.stock >= 10 ? '#059669' : '#e11d48' }}>
                                        {p.stock} Units
                                    </span>
                                    {p.stock < 10 && (
                                        <span style={{ 
                                            fontSize: '10px', 
                                            background: '#fee2e2', 
                                            color: '#b91c1c', 
                                            padding: '2px 6px', 
                                            borderRadius: '99px',
                                            fontWeight: '800',
                                            textAlign: 'center',
                                            width: 'fit-content'
                                        }}>
                                            LOW STOCK
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        onClick={() => { 
                                            setSelectedProduct(p); 
                                            setEditForm({
                                                name: p.name,
                                                category: p.category,
                                                brand: p.brand || "",
                                                mrp: p.mrp,
                                                selling_price: p.selling_price,
                                                image: p.image || ""
                                            });
                                            setIsEditOpen(true); 
                                        }}
                                        className="t-btn edit"
                                    >EDIT</button>
                                    <button
                                        onClick={() => { setSelectedProduct(p); setAdjustForm({...adjustForm, type: 'IN'}); setIsAdjustOpen(true); }}
                                        className="t-btn add"
                                    >+ STOCK</button>
                                    <button
                                        onClick={() => { setSelectedProduct(p); setAdjustForm({...adjustForm, type: 'OUT'}); setIsAdjustOpen(true); }}
                                        className="t-btn minus"
                                    >- DROP</button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Are you sure you want to delete ${p.name}? This will remove it from the active store node.`)) {
                                                try {
                                                    await api.delete(`/products/${p.id}`);
                                                    addToast("Product deleted successfully", "success");
                                                    fetchProducts();
                                                } catch (err) {
                                                    addToast("Failed to delete product", "error");
                                                }
                                            }
                                        }}
                                        className="t-btn delete"
                                        style={{ background: '#fee2e2', color: '#b91c1c' }}
                                    >DELETE</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Create Product Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onConfirm={handleCreate}
                title="Establish New Product Node"
                confirmText="Save Node"
            >
                <div className="elite-form">
                    <div className="elite-form-group">
                        <label>Asset Identity</label>
                        <input className="elite-input" placeholder="Product Name" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} />
                    </div>
                    <div className="elite-form-group">
                        <label>Category Classification</label>
                        <input className="elite-input" placeholder="e.g. Fertilizers" required value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>MRP (₹)</label>
                            <input className="elite-input" type="number" required value={createForm.mrp} onChange={e => setCreateForm({...createForm, mrp: e.target.value})} />
                        </div>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>Selling Price (₹)</label>
                            <input className="elite-input" type="number" required value={createForm.selling_price} onChange={e => setCreateForm({...createForm, selling_price: e.target.value})} />
                        </div>
                    </div>
                    <div className="elite-form-group">
                        <label>Image Asset URL</label>
                        <input className="elite-input" placeholder="https://" value={createForm.image} onChange={e => setCreateForm({...createForm, image: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>Initial Lifecycle Stock</label>
                            <input className="elite-input" type="number" required value={createForm.stock} onChange={e => setCreateForm({...createForm, stock: e.target.value})} />
                        </div>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>Supplier ID</label>
                            <input className="elite-input" type="number" required value={createForm.supplier_id} onChange={e => setCreateForm({...createForm, supplier_id: e.target.value})} />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Adjust Stock Modal */}
            <Modal
                isOpen={isAdjustOpen && !!selectedProduct}
                onClose={() => setIsAdjustOpen(false)}
                onConfirm={handleAdjust}
                title={`Modifying Inventory: ${selectedProduct?.name}`}
                confirmText="Inject Changes"
            >
                <div className="elite-form">
                    <div className="elite-form-group">
                        <label>Adjustment Vector</label>
                        <select className="elite-input elite-select" value={adjustForm.type} onChange={e => setAdjustForm({...adjustForm, type: e.target.value})}>
                            <option value="IN">ADD (INCOMING STOCK)</option>
                            <option value="OUT">REMOVE (OUTGOING SCRAP/SALES)</option>
                        </select>
                    </div>
                    <div className="elite-form-group">
                        <label>Quantity Delta</label>
                        <input className="elite-input" placeholder="Units" type="number" min="1" required value={adjustForm.quantity} onChange={e => setAdjustForm({...adjustForm, quantity: e.target.value})} />
                    </div>
                    <div className="elite-form-group">
                        <label>Justification Log</label>
                        <input className="elite-input" placeholder="e.g. MANUAL, RETURN" required value={adjustForm.reference_type} onChange={e => setAdjustForm({...adjustForm, reference_type: e.target.value})} />
                    </div>
                </div>
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={isEditOpen && !!selectedProduct}
                onClose={() => setIsEditOpen(false)}
                onConfirm={handleUpdate}
                title="Synchronize Product Specifications"
                confirmText="Push Updates"
            >
                <div className="elite-form">
                    <div className="elite-form-group">
                        <label>Asset Identity</label>
                        <input className="elite-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div className="elite-form-group">
                        <label>Category Group</label>
                        <input className="elite-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>MRP (₹)</label>
                            <input className="elite-input" type="number" value={editForm.mrp} onChange={e => setEditForm({...editForm, mrp: e.target.value})} />
                        </div>
                        <div className="elite-form-group" style={{ flex: 1 }}>
                            <label>List Price (₹)</label>
                            <input className="elite-input" type="number" value={editForm.selling_price} onChange={e => setEditForm({...editForm, selling_price: e.target.value})} />
                        </div>
                    </div>
                    <div className="elite-form-group">
                        <label>Asset URL</label>
                        <input className="elite-input" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} />
                    </div>
                </div>
            </Modal>

        </div>
    );
}
