import { useEffect, useState } from "react";
import useTranslationAdminStore from "../store/translationAdmin.store";
import { Search, Save, Trash2, Plus, RefreshCw, Languages } from "lucide-react";
import "@/styles/Admin.css";

export default function AdminTranslationsPage() {
    const { translations, loading, fetchTranslations, addTranslation, updateTranslation, deleteTranslation } = useTranslationAdminStore();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    
    // Modal state for adding entirely new translations
    const [showAddModal, setShowAddModal] = useState(false);
    const [newOriginal, setNewOriginal] = useState("");
    const [newGujarati, setNewGujarati] = useState("");

    useEffect(() => {
        fetchTranslations();
    }, []);

    const filteredTranslations = translations.filter(t => 
        t.original_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.translated_text.includes(searchQuery)
    );

    const handleStartEdit = (t) => {
        setEditingId(t.id);
        setEditValue(t.translated_text);
    };

    const handleSaveEdit = async (id) => {
        const success = await updateTranslation(id, editValue);
        if (success) {
            setEditingId(null);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const success = await addTranslation(newOriginal, newGujarati);
        if (success) {
            setShowAddModal(false);
            setNewOriginal("");
            setNewGujarati("");
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Languages size={28} color="#059669" />
                        Global Language Dictionary
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>
                        Manage vocabulary strictly enforced across the Gujarati platform overriding AI defaults.
                    </p>
                </div>
                <button className="btn-elite primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    <span>Assign Context Word</span>
                </button>
            </div>

            <div className="admin-table-filters" style={{ background: '#fff', padding: '20px 24px', borderRadius: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search English or Gujarati terms..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="modal-form-input"
                        style={{ width: '100%', paddingLeft: '48px', paddingRight: '20px', paddingBottom: '12px', paddingTop: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', fontWeight: '600' }}
                    />
                </div>
                <button onClick={fetchTranslations} className="t-btn view" style={{ padding: '12px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }} title="Sync Cache">
                    <RefreshCw size={18} className={loading ? "spin" : ""} />
                </button>
            </div>

            <div className="mandi-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Original Phrase (English)</th>
                            <th>Enforced Translation (Gujarati)</th>
                            <th style={{ width: '20%' }}>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && translations.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>Syncing Library...</td></tr>
                        ) : filteredTranslations.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No vocabulary limits established.</td></tr>
                        ) : (
                            filteredTranslations.map(t => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: '700', color: '#334155' }}>{t.original_text}</td>
                                    <td>
                                        {editingId === t.id ? (
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={editValue} 
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="modal-form-input"
                                                style={{ width: '100%', padding: '6px 12px', border: '2px solid #3b82f6', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(t.id)}
                                            />
                                        ) : (
                                            <span style={{ 
                                                fontSize: '15px', 
                                                fontWeight: '800', 
                                                color: '#059669',
                                                background: '#f0fdf4',
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                display: 'inline-block'
                                            }}>
                                                {t.translated_text}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {editingId === t.id ? (
                                                <>
                                                    <button onClick={() => handleSaveEdit(t.id)} className="t-btn edit" style={{ background: '#ecfeff', color: '#0891b2' }}><Save size={16} /> Save</button>
                                                    <button onClick={() => setEditingId(null)} className="t-btn view">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleStartEdit(t)} className="t-btn edit">Assign</button>
                                                    <button 
                                                        onClick={() => window.confirm(`Reset cache for "${t.original_text}" to allow generic AI translation?`) && deleteTranslation(t.id)} 
                                                        className="t-btn reject" 
                                                        title="Delete Custom Binding"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding manual context words */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Explicit Word Dictionary</h2>
                        </div>
                        <form onSubmit={handleAddSubmit} className="modal-form">
                            <div className="modal-form-group">
                                <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Original English Term</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="modal-form-input" 
                                    placeholder="e.g. Cotton" 
                                    value={newOriginal} 
                                    onChange={(e) => setNewOriginal(e.target.value)} 
                                />
                                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>This must exactly match the internal frontend string.</span>
                            </div>
                            <div className="modal-form-group">
                                <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Gujarati Agricultural Context</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="modal-form-input" 
                                    placeholder="e.g. કપાસ" 
                                    value={newGujarati} 
                                    onChange={(e) => setNewGujarati(e.target.value)} 
                                />
                                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Platform will now permanently enforce this meaning.</span>
                            </div>

                            <div className="modal-actions" style={{ marginTop: '32px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Discard</button>
                                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={16} /> Save to Database
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
