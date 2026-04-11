import { useState, useEffect } from "react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import useMandiStore from "@features/agriculture/mandi/mandi.store";
import useWeatherStore from "@features/agriculture/weather/weather.store";
import "@/styles/Admin.css";

const DISTRICTS = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskanth", "Bharuch", "Bhavnagar", 
    "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", 
    "Gir Somnath", "Jamnagar", "Junagarh", "Kachchh", "Kheda", "Mahisagar", "Mehsana", 
    "Morbi", "Narmada", "Navsari", "Panchmahals", "Patan", "Porbandar", "Rajkot", 
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara(Baroda)", "Valsad"
];

const COMMON_CROPS = [
    "Wheat", "Cotton", "Groundnut", "Castor Seed", "Cumin", "Mustard", "Guar Seed", 
    "Soyabean", "Onion", "Potato", "Tomato", "Brinjal", "Cauliflower"
];

export default function MandiPricesPage() {
    const { 
        prices, loading, filters, setFilters, fetchPrices, 
        totalCount, page, setPage, trends, trendsLoading, fetchTrends 
    } = useMandiStore();
    const { selectedLocation, initialize } = useWeatherStore();

    const [days, setDays] = useState(15);
    const [selectedCrop, setSelectedCrop] = useState("Cotton");
    const [selectedDistrict, setSelectedDistrict] = useState("Rajkot");

    // Unified District Sync
    useEffect(() => {
        initialize?.();
    }, [initialize]);

    useEffect(() => {
        if (selectedLocation) {
            const cityName = selectedLocation.name;
            const stateName = selectedLocation.state || "";
            
            // Try to find a match in the DISTRICTS list
            const match = DISTRICTS.find(d => 
                cityName.toLowerCase().includes(d.toLowerCase()) || 
                d.toLowerCase().includes(cityName.toLowerCase()) ||
                stateName.toLowerCase().includes(d.toLowerCase())
            );

            if (match) {
                setSelectedDistrict(match);
                setFilters({ district: match });
            }
        }
    }, [selectedLocation]);

    useEffect(() => {
        fetchPrices();
    }, [page, filters]);

    useEffect(() => {
        if (selectedCrop && selectedDistrict) {
            fetchTrends(selectedCrop, selectedDistrict, days);
        }
    }, [selectedCrop, selectedDistrict, days]);

    const handleFilterChange = (e) => {
        setFilters({ [e.target.name]: e.target.value });
    };

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>Mandi Intelligence Hub</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Precision commodity tracking and historical price radar.</p>
                </div>
            </div>

            {/* MARKET RADAR ANALYTICS */}
            <div className="market-radar-section" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                padding: '24px',
                borderRadius: '24px',
                marginBottom: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#064e4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                            Interactive Market Radar
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Analyze price volatility for specific crop/district combinations.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '6px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Radar Window:</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input 
                                type="number" 
                                value={days} 
                                onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
                                style={{ 
                                    width: '52px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    padding: '4px 6px', 
                                    fontSize: '13px', 
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    color: '#0f172a',
                                    outline: 'none'
                                }}
                            />
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Days</span>
                        </div>
                    </div>
                </div>

                <div className="agri-grid-1-3">
                    <div className="radar-controls" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="control-field">
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Target Commodity</label>
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="modal-form-input" 
                                style={{ width: '100%', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                            >
                                {COMMON_CROPS.map((c, idx) => <option key={`${c}-${idx}`} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="control-field">
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Market District</label>
                            <select 
                                value={selectedDistrict} 
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="modal-form-input" 
                                style={{ width: '100%', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
                            >
                                {DISTRICTS.map((d, idx) => <option key={`${d}-${idx}`} value={d}>{d}</option>)}
                            </select>
                        </div>
                        
                        {trends.length > 0 && (
                            <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7' }}>
                                <p style={{ fontSize: '11px', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Current Insights</p>
                                <p style={{ fontSize: '20px', fontWeight: '900', color: '#064e4b', marginTop: '4px' }}>₹{trends[trends.length-1]?.modal || trends[trends.length-1]?.[selectedCrop] || "N/A"}</p>
                                <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginTop: '2px' }}>Latest Modal Price</p>
                            </div>
                        )}
                    </div>

                    <div className="radar-chart-container" style={{ height: '300px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', minWidth: 'min(500px, 100vw)' }}>
                        {trendsLoading ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
                                Syncing Market Radar Data...
                            </div>
                        ) : trends.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        style={{ fontSize: '12px', fontWeight: '600' }} 
                                        tick={{fill: '#94a3b8'}}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        style={{ fontSize: '12px', fontWeight: '600' }} 
                                        tick={{fill: '#94a3b8'}}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="modal" 
                                        name="Modal Price" 
                                        stroke="#10b981" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorModal)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                                No recent data found for this selection.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Price Feed Section */}
            <div className="admin-table-filters" style={{ 
                background: '#fff', 
                padding: '20px 24px', 
                borderRadius: '20px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Search Crop</label>
                    <select name="commodity" value={filters.commodity} onChange={handleFilterChange} className="modal-form-input" style={{ width: '100%', padding: '10px', borderRadius: '12px' }}>
                        <option value="">All Commodities</option>
                        {COMMON_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Market District</label>
                    <select name="district" value={filters.district} onChange={handleFilterChange} className="modal-form-input" style={{ width: '100%', padding: '10px', borderRadius: '12px' }}>
                        <option value="">All Districts</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Arrival Date</label>
                    <input 
                        type="date" 
                        name="date" 
                        value={filters.date} 
                        onChange={handleFilterChange} 
                        className="modal-form-input" 
                        style={{ width: '100%', padding: '9px', borderRadius: '12px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button 
                        className="btn-elite primary" 
                        style={{ padding: '10px 24px', borderRadius: '12px' }}
                        onClick={() => {
                            setPage(1);
                            fetchPrices();
                        }}
                    >
                        Sync Data
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Collecting market data...</div>
            ) : (
                <div className="mandi-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Market (Mandi)</th>
                                <th>District</th>
                                <th>Commodity</th>
                                <th>Min Price</th>
                                <th>Max Price</th>
                                <th>Modal Price</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>{p.market}</td>
                                    <td>{p.district}</td>
                                    <td>
                                        <span style={{ 
                                            background: '#f0fdf4', 
                                            color: '#166534', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>{p.commodity}</span>
                                    </td>
                                    <td>₹{p.min_price}</td>
                                    <td>₹{p.max_price}</td>
                                    <td style={{ fontWeight: '700', color: '#059669' }}>₹{p.modal_price}</td>
                                    <td>{new Date(p.arrival_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                            Showing page <span style={{ color: '#0f172a', fontWeight: '800' }}>{page}</span> 
                            {totalCount > 0 && <span> — Results <span style={{ color: '#0f172a', fontWeight: '800' }}>{((page-1)*20)+1} to {Math.min(page*20, totalCount)}</span> of <span style={{ color: '#0f172a', fontWeight: '800' }}>{totalCount}</span></span>}
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                className="t-btn view" 
                                style={{ 
                                    padding: '8px 16px', borderRadius: '8px', background: page === 1 ? '#f1f5f9' : '#fff', 
                                    border: '1px solid #e2e8f0', color: page === 1 ? '#94a3b8' : '#0f172a', fontWeight: '700',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                                }}
                                disabled={page === 1}
                                onClick={() => {
                                    setPage(page - 1);
                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                }}
                            >
                                ← Previous Page
                            </button>
                            <button 
                                className="t-btn view" 
                                style={{ 
                                    padding: '8px 16px', borderRadius: '8px', background: prices.length < 20 ? '#f1f5f9' : '#fff', 
                                    border: '1px solid #e2e8f0', color: prices.length < 20 ? '#94a3b8' : '#0f172a', fontWeight: '700',
                                    cursor: prices.length < 20 ? 'not-allowed' : 'pointer'
                                }}
                                disabled={prices.length < 20}
                                onClick={() => {
                                    setPage(page + 1);
                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                }}
                            >
                                Next Page →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
