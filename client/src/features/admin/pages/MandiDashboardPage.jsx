import { useEffect, useState } from "react";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import useMandiStore from "@features/agriculture/mandi/mandi.store";
import "@/styles/Admin.css";

const COMMON_CROPS = [
    "Wheat", "Cotton", "Groundnut", "Castor Seed", "Cumin", "Mustard", "Guar Seed", 
    "Soyabean", "Onion", "Potato", "Tomato"
];

export default function MandiDashboardPage() {
    const { 
        summary, fetchSummary, cropTrends, fetchCropTrends, 
        districtTrends, fetchDistrictTrends,
        bestMandi, fetchBestMandi,
        fetchMultiCropTrends
    } = useMandiStore();

    const [selectedCrop, setSelectedCrop] = useState("Wheat");
    const [days, setDays] = useState(30);
    const [multiData, setMultiData] = useState([]);

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        if (selectedCrop) {
            fetchCropTrends(selectedCrop, days);
            fetchDistrictTrends(selectedCrop);
            fetchBestMandi(selectedCrop);
            
            // Fetch Multi-Crop Comparison
            fetchMultiCropTrends("Wheat,Cotton,Groundnut", days).then(data => setMultiData(data || []));
        }
    }, [selectedCrop, days]);

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div>
                    <h2>Regional Market Intelligence</h2>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Data-driven insights for optimized harvest liquidation.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        value={selectedCrop} 
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="modal-form-input"
                        style={{ padding: '8px 16px', borderRadius: '50px' }}
                    >
                        {COMMON_CROPS.map((c, idx) => <option key={`${c}-${idx}`} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="summary-grid" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px', marginBottom: '30px' 
            }}>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                    <p style={{ opacity: 0.8, fontSize: '13px' }}>Total Active Mandis</p>
                    <h3 style={{ fontSize: '28px', margin: '8px 0', color: 'white' }}>{summary?.totalMandis || 0}</h3>
                    <p style={{ fontSize: '11px' }}>Gujarat State Network</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Peak Price ({selectedCrop})</p>
                    <h3 style={{ fontSize: '28px', margin: '8px 0' }}>₹{bestMandi?.modal_price || 0}</h3>
                    <p style={{ fontSize: '11px', color: '#059669' }}>At {bestMandi?.market || 'N/A'}</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Overall Max Rate</p>
                    <h3 style={{ fontSize: '28px', margin: '8px 0' }}>₹{summary?.highestPrice || 0}</h3>
                    <p style={{ fontSize: '11px', color: '#10b981' }}>Across all commodities</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Crop Trend Chart */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0 }}>Price Trend: {selectedCrop}</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Timeline:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input 
                                    type="number" 
                                    value={days} 
                                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
                                    style={{ 
                                        width: '45px', 
                                        border: '1px solid #e2e8f0', 
                                        borderRadius: '4px', 
                                        padding: '2px 4px', 
                                        fontSize: '12px', 
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        outline: 'none',
                                        color: '#0f172a'
                                    }}
                                />
                                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>D</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cropTrends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                                <YAxis tick={{fontSize: 10}} domain={['auto', 'auto']} />
                                <Tooltip />
                                <Area type="monotone" dataKey="modal" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* District Comparison Chart */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginBottom: '20px' }}>District Comparison (Avg Price)</h4>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={districtTrends.slice(0, 8)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="district" tick={{fontSize: 10}} />
                                <YAxis tick={{fontSize: 10}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="avg_price" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0 }}>Comparative Performance (Wheat vs Cotton vs Groundnut)</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Avg Modal Price (All Mandis)</span>
                </div>
                <div style={{ height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={multiData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                            <YAxis tick={{fontSize: 10}} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Wheat" stroke="#10b981" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="Cotton" stroke="#3b82f6" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="Groundnut" stroke="#f59e0b" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Refresh utility */}
            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.5 }}>
                <button 
                    onClick={() => window.location.reload()}
                    style={{ background: 'none', border: '1px dashed #cbd5e1', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                >
                    Refresh Market Data
                </button>
            </div>
        </div>
    );
}
