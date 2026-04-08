import React, { useState, useEffect } from 'react';
import useAdvisoryStore from '../../store/advisoryStore';
import { 
    Sprout, 
    MapPin, 
    Navigation, 
    AlertTriangle, 
    Thermometer, 
    Droplets, 
    CloudRain,
    ChevronRight,
    History,
    TrendingUp,
    ShieldCheck,
    Loader2,
    Calendar,
    Target
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import '../../styles/agriIntelligence.css';

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Soybean", "Maize"];
const STAGES = ["Sowing", "Vegetative", "Flowering", "Fruiting", "Harvesting"];

const CropAdvisoryPage = () => {
    const { curAdvisory, history, loading, error, generateAdvisory, fetchHistory, clearCurrent } = useAdvisoryStore();
    
    const [formData, setFormData] = useState({
        crop: "Wheat",
        stage: "Sowing",
        location: "",
        lat: null,
        lon: null
    });

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleLocationDetect = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({ 
                    ...prev, 
                    lat: pos.coords.latitude, 
                    lon: pos.coords.longitude,
                    location: "Detected Location" 
                }));
            },
            (err) => {
                console.error(err);
                alert("Unable to detect location. Please enter manually.");
            }
        );
    };

    const handleGenerate = () => {
        if (!formData.location && (!formData.lat || !formData.lon)) {
            alert("Please provide a location");
            return;
        }
        generateAdvisory(formData);
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#f59e0b';
            case 'LOW': return '#10b981';
            default: return '#94a3b8';
        }
    };

    // Prepare chart data from history
    const chartData = [...history].reverse().map(h => ({
        date: new Date(h.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        risk: h.risk_level === 'HIGH' ? 3 : h.risk_level === 'MEDIUM' ? 2 : 1,
        temp: h.weather_data?.main?.temp || h.weather_data?.temp || 0
    }));

    return (
        <div className="agri-page">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="agri-title">Smart Crop Advisory</h1>
                <p style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={16} className="agri-green" />
                    Rule-based AI intelligence for sustainable farming
                </p>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                
                {/* LEFT: Generator Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="agri-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Sprout className="agri-green" /> Parameters
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Select Crop</label>
                                <select 
                                    value={formData.crop}
                                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#fff' }}
                                >
                                    {CROPS.map(c => <option key={c} value={c} style={{ background: '#022c22' }}>{c}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Growth Stage</label>
                                <select 
                                    value={formData.stage}
                                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#fff' }}
                                >
                                    {STAGES.map(s => <option key={s} value={s} style={{ background: '#022c22' }}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Location</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text"
                                        placeholder="City / Village Name"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value, lat: null, lon: null})}
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#fff' }}
                                    />
                                    <button 
                                        onClick={handleLocationDetect}
                                        className="agri-card"
                                        style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer' }}
                                        title="Auto-detect GPS"
                                    >
                                        <Navigation size={18} className="agri-green" />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="agri-card"
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem', 
                                    marginTop: '1rem',
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem'
                                }}
                            >
                                {loading ? <Loader2 className="spin" size={20} /> : <ShieldCheck size={20} />}
                                Generate Advisory
                            </button>
                        </div>
                    </div>

                    {/* HISTORY TREND */}
                    <div className="agri-card" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <TrendingUp className="agri-green" /> Environmental Trends
                        </h3>
                        <div style={{ width: '100%', height: '200px' }}>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ background: '#064e40', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#10b981' }}
                                        />
                                        <Area type="monotone" dataKey="temp" stroke="#10b981" fillOpacity={1} fill="url(#colorTemp)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                                    No historical data available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Results Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {error && (
                        <div className="agri-card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {!curAdvisory && !loading && history.length === 0 && (
                        <div className="agri-card" style={{ padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
                            <Sprout size={48} style={{ margin: '0 auto 1.5rem', color: '#10b981' }} />
                            <h3>Ready to assist you.</h3>
                            <p>Enter your crop details to get AI-powered agricultural recommendations.</p>
                        </div>
                    )}

                    {(curAdvisory || loading) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Weather Header */}
                            <div className="agri-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.3rem' }}>TEMPERATURE</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                            <Thermometer size={20} className="agri-green" />
                                            {loading ? '...' : Math.round(curAdvisory?.weather_data?.main?.temp || 0)}°C
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.3rem' }}>HUMIDITY</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                            <Droplets size={20} className="agri-green" />
                                            {loading ? '...' : curAdvisory?.weather_data?.main?.humidity}%
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.3rem' }}>CONDITION</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                            <CloudRain size={20} className="agri-green" />
                                            {loading ? '...' : curAdvisory?.weather_data?.weather?.[0]?.main}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.3rem' }}>SEASONAL ACCURACY</p>
                                    <div style={{ 
                                        padding: '0.4rem 1.2rem', 
                                        borderRadius: '2rem', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 'bold',
                                        background: curAdvisory?.accuracy_meta?.season_match ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: curAdvisory?.accuracy_meta?.season_match ? '#10b981' : '#ef4444',
                                        border: `1px solid ${curAdvisory?.accuracy_meta?.season_match ? '#10b981' : '#ef4444'}`
                                    }}>
                                        {curAdvisory?.accuracy_meta?.season_match ? 'IN-SEASON' : 'OFF-SEASON'}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.3rem' }}>RISK LEVEL</p>
                                    <div style={{ 
                                        padding: '0.4rem 1.2rem', 
                                        borderRadius: '2rem', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 'bold',
                                        background: getRiskColor(curAdvisory?.risk_level) + '20',
                                        color: getRiskColor(curAdvisory?.risk_level),
                                        border: `1px solid ${getRiskColor(curAdvisory?.risk_level)}`
                                    }}>
                                        {loading ? 'ANALYZING...' : curAdvisory?.risk_level}
                                    </div>
                                </div>
                            </div>


                            {/* Advisory Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {loading ? (
                                    [1, 2].map(i => <div key={i} className="agri-card skeleton" style={{ height: '100px' }}></div>)
                                ) : (
                                    curAdvisory?.advisory.map((item, idx) => (
                                        <div key={idx} className="agri-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.2rem' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '0.8rem', 
                                                background: 'rgba(255,255,255,0.05)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>
                                                {item.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ color: '#fff', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {item.title}
                                                </h4>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5 }}>
                                                    {item.message}
                                                </p>
                                            </div>
                                            <ChevronRight size={18} style={{ opacity: 0.3 }} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* HISTORY LIST */}
                    <div className="agri-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <History size={18} className="agri-green" /> Recent Histories
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {history.length > 0 ? history.map((h) => (
                                <div key={h.id} className="history-item" style={{ 
                                    padding: '1rem', 
                                    borderRadius: '0.6rem', 
                                    background: 'rgba(255,255,255,0.02)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '4px', height: '20px', background: getRiskColor(h.risk_level), borderRadius: '4px' }}></div>
                                        <div>
                                            <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{h.crop} - <span style={{ opacity: 0.6 }}>{h.stage}</span></p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Calendar size={10} /> {new Date(h.created_at).toLocaleString()} | <MapPin size={10} /> {h.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                        {Math.round(h.weather_data?.main?.temp || h.weather_data?.temp || 0)}°C
                                    </div>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', opacity: 0.4, padding: '1rem' }}>No history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropAdvisoryPage;
