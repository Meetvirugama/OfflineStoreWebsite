import React, { useEffect, useState } from 'react';
import useFarmerStore from '@features/dashboard/store/farmer.store';
import { 
    Activity, Sprout, TrendingUp, AlertTriangle, 
    Wallet, Plus, Trash2, CheckCircle2, CloudLightning, LineChart 
} from 'lucide-react';
import '@/styles/agriIntelligence.css';

const FarmerDashboardPage = () => {
    const { 
        savedCrops, profitStats, recommendations, 
        loading, error, fetchDashboardData, addCrop, removeCrop, addSaleRecord 
    } = useFarmerStore();

    const [formCrop, setFormCrop] = useState({ crop_name: '', season: 'Kharif', area_acres: '' });
    const [formSale, setFormSale] = useState({ crop_name: '', investment: '', revenue: '' });

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleAddCrop = (e) => {
        e.preventDefault();
        addCrop(formCrop);
        setFormCrop({ crop_name: '', season: 'Kharif', area_acres: '' });
    };

    const handleAddSale = (e) => {
        e.preventDefault();
        addSaleRecord({ ...formSale, investment: Number(formSale.investment), revenue: Number(formSale.revenue) });
        setFormSale({ crop_name: '', investment: '', revenue: '' });
    };

    const getRecommendationColor = (action) => {
        if (action === "SELL NOW") return "#10b981"; // Green
        if (action === "WAIT") return "#f59e0b"; // Yellow
        if (action === "HOLD") return "#ef4444"; // Red
        return "rgba(255,255,255,0.5)";
    };

    if (loading && !savedCrops.length) {
        return (
            <div className="agri-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Activity className="spin agri-green" size={48} />
            </div>
        );
    }

    return (
        <div className="agri-page">
            <h1 className="agri-title">🌾 My Farm Dashboard</h1>
            <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Manage your yields, track financial profits, and get smart market selling recommendations.</p>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            {/* OVERVIEW STATS */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <Sprout size={24} className="agri-green" />
                    <div>
                        <h3>{savedCrops.length}</h3>
                        <p>Active Crops</p>
                    </div>
                </div>
                <div className="stat-card">
                    <Wallet size={24} style={{ color: '#3b82f6' }} />
                    <div>
                        <h3>₹{profitStats?.netProfit?.toLocaleString() || 0}</h3>
                        <p>Net Profit</p>
                    </div>
                </div>
                <div className="stat-card">
                    <TrendingUp size={24} style={{ color: '#f59e0b' }} />
                    <div>
                        <h3 style={{ color: profitStats?.profitMargin > 0 ? '#10b981' : '#fff' }}>
                            {profitStats?.profitMargin}%
                        </h3>
                        <p>Profit Margin</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid farmer-two-col" style={{ gap: '2rem' }}>
                
                {/* LEFT COL: CROP & FINANCIAL MANAGEMENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* ADD CROP */}
                    <div className="agri-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Register Crop
                        </h3>
                        <form onSubmit={handleAddCrop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="Crop Name (e.g., Wheat)" value={formCrop.crop_name} onChange={e => setFormCrop({...formCrop, crop_name: e.target.value})} className="search-input-field" required style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                            <select value={formCrop.season} onChange={e => setFormCrop({...formCrop, season: e.target.value})} className="search-input-field" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                                <option value="Kharif">Kharif (Monsoon)</option>
                                <option value="Rabi">Rabi (Winter)</option>
                                <option value="Zaid">Zaid (Summer)</option>
                            </select>
                            <input type="number" step="0.1" placeholder="Area (acres)" value={formCrop.area_acres} onChange={e => setFormCrop({...formCrop, area_acres: e.target.value})} className="search-input-field" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                            <button className="auth-btn" style={{ padding: '0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold' }}>Save Crop</button>
                        </form>
                    </div>

                    {/* LOG HARVEST PROFIT */}
                    <div className="agri-card" style={{ padding: '1.5rem', background: 'linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LineChart size={18} /> Log Harvest Sale
                        </h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>Log your sales against your fertilizer investment to track true profitability.</p>
                        
                        <form onSubmit={handleAddSale} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <select value={formSale.crop_name} onChange={e => setFormSale({...formSale, crop_name: e.target.value})} className="search-input-field" required style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                                <option value="" disabled>Select a crop</option>
                                {savedCrops.map(c => <option key={c.id} value={c.crop_name}>{c.crop_name}</option>)}
                                <option value="Other">Other</option>
                            </select>
                            <input type="number" placeholder="Investment Cost (₹)" required value={formSale.investment} onChange={e => setFormSale({...formSale, investment: e.target.value})} className="search-input-field" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                            <input type="number" placeholder="Sale Revenue (₹)" required value={formSale.revenue} onChange={e => setFormSale({...formSale, revenue: e.target.value})} className="search-input-field" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                            <button className="auth-btn" style={{ padding: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold' }}>Record Sale</button>
                        </form>
                    </div>

                </div>

                {/* RIGHT COL: SMART SELLING INTELLIGENCE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <CloudLightning className="agri-green" /> Smart Selling Advisory
                    </h2>

                    {savedCrops.length === 0 ? (
                        <div className="agri-card" style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                            <Sprout size={48} style={{ margin: '0 auto 1rem' }} />
                            <p>Register a crop to receive AI market sale recommendations.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {savedCrops.map(crop => {
                                const recInfo = recommendations[crop.crop_name];
                                const isEvaluating = !recInfo;

                                return (
                                    <div key={crop.id} className="agri-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                        {/* Colored header line based on decision */}
                                        <div style={{ height: '4px', background: isEvaluating ? 'gray' : getRecommendationColor(recInfo.action), position: 'absolute', top: 0, left: 0, right: 0 }}></div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem 1.5rem 0.5rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.3rem 0' }}>{crop.crop_name}</h3>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{crop.area_acres} Acres • {crop.season}</span>
                                            </div>
                                            <button onClick={() => removeCrop(crop.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }} title="Remove Crop">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div style={{ padding: '0 1.5rem 1.5rem' }}>
                                            {isEvaluating ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.5, marginTop: '1rem' }}>
                                                    <Activity className="spin" size={16} /> Parsing market algorithms...
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    
                                                    {recInfo.urgent_alert && (
                                                        <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.8rem', borderRadius: '0.4rem', borderLeft: '3px solid #ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                                            <strong>⚠️ WEATHER OVERRIDE:</strong> {recInfo.urgent_alert}
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                            <div style={{ 
                                                                padding: '0.4rem 1rem', 
                                                                borderRadius: '2rem', 
                                                                fontWeight: 'bold', 
                                                                fontSize: '0.85rem',
                                                                color: '#000',
                                                                background: getRecommendationColor(recInfo.action)
                                                            }}>
                                                                {recInfo.action}
                                                            </div>
                                                            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Market Trend: {recInfo.market_intel?.trend}</span>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{recInfo.market_intel?.currentPrice || '--'}</span>
                                                            <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block' }}>Current avg / q</span>
                                                        </div>
                                                    </div>

                                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, opacity: 0.8 }}>
                                                        {recInfo.market_intel?.reason}
                                                    </p>
                                                    
                                                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <CheckCircle2 size={12} /> Powered by AgroMart Smart Engine
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboardPage;
