import { useState, useEffect } from "react";
import api from "../../services/axiosInstance";
import "@/styles/Admin.css"; // Basic minimal styles
import useToastStore from "@core/hooks/useToast";
import AgroLoader from "@core/components/AgroLoader";

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
                                <span style={{ fontWeight: 'bold', color: p.stock > 10 ? '#059669' : '#e11d48' }}>
                                    {p.stock} Units
                                </span>
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
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Create Product Modal */}
            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Product</h3>
                        <form onSubmit={handleCreate} className="modal-form">
                            <input placeholder="Product Name" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} />
                            <input placeholder="Category Group" required value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})} />
                            <input placeholder="Manufacturer / Brand" value={createForm.brand} onChange={e => setCreateForm({...createForm, brand: e.target.value})} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input placeholder="MRP" type="number" required value={createForm.mrp} onChange={e => setCreateForm({...createForm, mrp: e.target.value})} style={{flex: 1}} />
                                <input placeholder="Selling List Price" type="number" required value={createForm.selling_price} onChange={e => setCreateForm({...createForm, selling_price: e.target.value})} style={{flex: 1}} />
                            </div>
                            <input placeholder="Public Image URL" value={createForm.image} onChange={e => setCreateForm({...createForm, image: e.target.value})} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input placeholder="Initial Stock" type="number" required value={createForm.stock} onChange={e => setCreateForm({...createForm, stock: e.target.value})} style={{flex: 1}} />
                                <input placeholder="Supplier ID" type="number" required value={createForm.supplier_id} onChange={e => setCreateForm({...createForm, supplier_id: e.target.value})} style={{flex: 1}} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsCreateOpen(false)}>Cancel Drop</button>
                                <button type="submit" className="btn-elite primary">Save Product Node</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Adjust Stock Modal */}
            {isAdjustOpen && selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Adjust Stock: {selectedProduct.name}</h3>
                        <p style={{ margin: '0 0 15px', color: '#64748b' }}>Current Count: <strong style={{ color: '#0f172a' }}>{selectedProduct.stock} Units</strong></p>
                        <form onSubmit={handleAdjust} className="modal-form">
                            <select value={adjustForm.type} onChange={e => setAdjustForm({...adjustForm, type: e.target.value})}>
                                <option value="IN">ADD (INCOMING STOCK)</option>
                                <option value="OUT">REMOVE (OUTGOING SCRAP/SALES)</option>
                            </select>
                            <input placeholder="Modifier Quantity" type="number" min="1" required value={adjustForm.quantity} onChange={e => setAdjustForm({...adjustForm, quantity: e.target.value})} />
                            <input placeholder="Justification Log (e.g. MANUAL, RETURN)" required value={adjustForm.reference_type} onChange={e => setAdjustForm({...adjustForm, reference_type: e.target.value})} />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsAdjustOpen(false)}>Abort Change</button>
                                <button type="submit" className="btn-elite primary">Confirm Injection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditOpen && selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Product: {selectedProduct.name}</h3>
                        <form onSubmit={handleUpdate} className="modal-form">
                            <input placeholder="Product Name" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            <input placeholder="Category Group" required value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
                            <input placeholder="Manufacturer / Brand" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input placeholder="MRP" type="number" required value={editForm.mrp} onChange={e => setEditForm({...editForm, mrp: e.target.value})} style={{flex: 1}} />
                                <input placeholder="Selling List Price" type="number" required value={editForm.selling_price} onChange={e => setEditForm({...editForm, selling_price: e.target.value})} style={{flex: 1}} />
                            </div>
                            <input placeholder="Public Image URL" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsEditOpen(false)}>Discard</button>
                                <button type="submit" className="btn-elite primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
