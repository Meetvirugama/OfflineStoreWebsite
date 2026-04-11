import { useEffect, useState } from "react";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import DynText from "@core/i18n/DynText";
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

    const TIMELINE_OPTIONS = [
        { label: "7 Days", value: 7 },
        { label: "15 Days", value: 15 },
        { label: "30 Days", value: 30 },
        { label: "90 Days", value: 90 },
        { label: "All Time (1 Year)", value: 365 }
    ];

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}><DynText text="Regional Market Intelligence" /></h2>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}><DynText text="Live spatial tracking of commodity price velocity across Gujarat." /></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select 
                        value={selectedCrop} 
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="modal-form-input"
                        style={{ padding: '10px 20px', borderRadius: '12px', background: '#fff', border: '1.5px solid #e2e8f0', fontWeight: '700' }}
                    >
                        {COMMON_CROPS.map((c, idx) => <option key={`${c}-${idx}`} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="summary-grid">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '28px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)' }}>
                    <p style={{ opacity: 0.9, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}><DynText text="Active Trade Nodes" /></p>
                    <h3 style={{ fontSize: '36px', margin: '12px 0', color: 'white', fontWeight: '900' }}>{summary?.totalMandis || 0}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}><DynText text="Gujarat Integrated Network" /></span>
                    </div>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}><DynText text="Peak Price Index" /> (<DynText text={selectedCrop} />)</p>
                    <h3 style={{ fontSize: '36px', margin: '12px 0', fontWeight: '900', color: '#0f172a' }}>₹{bestMandi?.modal_price || 0}</h3>
                    <p style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}><DynText text="Benchmark at" /> <DynText text={bestMandi?.market || 'Primary Terminal'} /></p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}><DynText text="Market Ceiling (Highest)" /></p>
                    <h3 style={{ fontSize: '36px', margin: '12px 0', fontWeight: '900', color: '#0f172a' }}>₹{summary?.highestPrice || 0}</h3>
                    <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}><DynText text="Regional High Intensity Point" /></p>
                </div>
            </div>

            <div className="agri-grid-2-1">
                {/* Crop Trend Chart */}
                <div style={{ background: '#fff', padding: 'clamp(16px, 5vw, 32px)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minWidth: '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}><DynText text="Historical Price Radar" />: <DynText text={selectedCrop} /></h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}><DynText text="Time Window" />:</span>
                            <select 
                                value={days}
                                onChange={(e) => setDays(parseInt(e.target.value))}
                                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', fontWeight: '800', color: '#0f172a', cursor: 'pointer' }}
                            >
                                {TIMELINE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cropTrends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}} 
                                    tickFormatter={(v) => v.split('-').slice(1).join('/')}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}} 
                                    domain={['auto', 'auto']}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₹${v}`}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                />
                                <Area type="monotone" dataKey="modal" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* District Comparison Chart */}
                <div style={{ background: '#fff', padding: 'clamp(16px, 5vw, 32px)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minWidth: '0' }}>
                    <h4 style={{ marginBottom: '32px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}><DynText text="District Intensity Map (Avg)" /></h4>
                    <div style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={districtTrends.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="district" 
                                    tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="avg_price" name="Avg Modal Price" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0 }}><DynText text="Comparative Performance" /> (<DynText text="Wheat" /> vs <DynText text="Cotton" /> vs <DynText text="Groundnut" />)</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}><DynText text="Avg Modal Price (All Mandis)" /></span>
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
                    <DynText text="Refresh Market Data" />
                </button>
            </div>
        </div>
    );
}
