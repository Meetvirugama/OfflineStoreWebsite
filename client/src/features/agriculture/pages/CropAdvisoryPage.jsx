import React, { useState, useEffect, useCallback } from 'react';
import useAdvisoryStore from '@features/agriculture/crop/advisory.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
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
    Target,
    RefreshCw
} from 'lucide-react';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import DynText from '@core/i18n/DynText';
import '@/styles/agriIntelligence.css';

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Soybean", "Maize"];
const STAGES = ["Sowing", "Vegetative", "Flowering", "Fruiting", "Harvesting"];

const CropAdvisoryPage = () => {
    const { curAdvisory, history, loading, error, generateAdvisory, fetchHistory } = useAdvisoryStore();
    const { selectedLocation, initialize } = useWeatherStore();
    const [syncStatus, setSyncStatus] = useState('SYNCED');
    
    const [formData, setFormData] = useState({
        crop: "Wheat",
        stage: "Sowing",
        location: selectedLocation?.name || "",
        lat: selectedLocation?.lat || null,
        lon: selectedLocation?.lon || null
    });

    const init = useCallback(async () => {
        await initialize?.();
        await fetchHistory();
    }, [initialize, fetchHistory]);

    useEffect(() => {
        init();
    }, [init]);

    // Sync with global location changes
    useEffect(() => {
        if (selectedLocation) {
            setFormData(prev => ({
                ...prev,
                location: selectedLocation.name,
                lat: selectedLocation.lat,
                lon: selectedLocation.lon
            }));
            setSyncStatus('SYNCED');
        }
    }, [selectedLocation]);

    const handleLocationDetect = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setSyncStatus('DETECTING');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({ 
                    ...prev, 
                    lat: pos.coords.latitude, 
                    lon: pos.coords.longitude,
                    location: "Detected Location" 
                }));
                setSyncStatus('MANUAL');
            },
            (err) => {
                console.error(err);
                setSyncStatus('ERROR');
                alert("Unable to detect location. Please enter manually.");
            }
        );
    };

    const handleGenerate = async () => {
        if (!formData.location && (!formData.lat || !formData.lon)) {
            alert("Please provide a location");
            return;
        }
        try {
            await generateAdvisory(formData);
        } catch (err) {
            console.error("Advisory generation failed", err);
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#f59e0b';
            case 'LOW': return '#10b981';
            default: return '#94a3b8';
        }
    };

    const chartData = [...history].reverse().map(h => ({
        date: new Date(h.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        risk: h.risk_level === 'HIGH' ? 3 : h.risk_level === 'MEDIUM' ? 2 : 1,
        temp: h.weather_data?.main?.temp || 0
    }));

    return (
        <div className="agri-page">
            <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="agri-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                            <Target className="agri-green" size={32} />
                        </div>
                        <DynText text="Smart Advisory Terminal" />
                    </h1>
                    <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ShieldCheck size={18} className="agri-green" />
                        <DynText text="Rule-based AI indexing for precision spatial agriculture" />.
                    </p>
                </div>
                <div className="weather-badge" style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 800, letterSpacing: '1px', fontSize: '0.75rem' }}>
                    {syncStatus === 'SYNCED' ? <ShieldCheck size={16} /> : <RefreshCw size={16} className={syncStatus === 'DETECTING' ? 'spin' : ''} />}
                    <DynText text={syncStatus === 'SYNCED' ? 'SYSTEM SYNCED' : syncStatus.toUpperCase()} />
                </div>
            </header>

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(380px, 420px) 1fr', gap: '3rem' }}>
                
                {/* LEFT: Generator Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
                            <div style={{width: '6px', height: '24px', background: 'var(--agri-green)', borderRadius: '4px'}}></div>
                            <DynText text="Telemetry Parameters" />
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}><DynText text="IDENTIFIED CROP" /></label>
                                <select 
                                    value={formData.crop}
                                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                                    style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {CROPS.map(c => <option key={c} value={c} style={{ background: '#ffffff', color: '#1e293b' }}><DynText text={c.toUpperCase()} /></option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}><DynText text="GROWTH VELOCITY" /></label>
                                <select 
                                    value={formData.stage}
                                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                                    style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {STAGES.map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#1e293b' }}><DynText text={s.toUpperCase()} /></option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}><DynText text="SPATIAL CONTEXT" /></label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                        <input 
                                            type="text"
                                            placeholder="City / Village Index"
                                            value={formData.location}
                                            onChange={(e) => {
                                                setFormData({...formData, location: e.target.value, lat: null, lon: null});
                                                setSyncStatus('MANUAL');
                                            }}
                                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleLocationDetect}
                                        className="agri-card hover-bg"
                                        style={{ padding: '0', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', cursor: 'pointer', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                    >
                                        <Navigation size={22} className="agri-green" />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="agri-card"
                                style={{ 
                                    width: '100%', 
                                    padding: '1.5rem', 
                                    marginTop: '1.5rem',
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                                    color: '#fff',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    border: 'none',
                                    borderRadius: '20px',
                                    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
                                    letterSpacing: '1px'
                                }}
                            >
                                {loading ? <Loader2 className="spin" size={24} /> : <ShieldCheck size={24} />}
                                <DynText text={loading ? 'SYNCHRONIZING' : 'INITIALIZE ADVISORY'} />
                            </button>
                        </div>
                    </div>

                    {/* HISTORY TREND */}
                    <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem', fontWeight: 800 }}>
                            <TrendingUp className="agri-green" size={22} /> <DynText text="Risk Density Matrix" />
                        </h3>
                        <div style={{ width: '100%', height: '240px' }}>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                                        <XAxis dataKey="date" stroke="rgba(0,0,0,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(0,0,0,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', color: '#1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                            itemStyle={{ color: '#10b981', fontWeight: 800 }}
                                        />
                                        <Area type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                                    <p style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '0.8rem', color: '#64748b' }}><DynText text="WAITING FOR TELEMETRY" /></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Results Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {error && (
                        <div className="agri-card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '2rem', display: 'flex', gap: '1.2rem', alignItems: 'center', borderRadius: '24px' }}>
                            <AlertTriangle size={32} />
                            <div>
                                <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: 900 }}><DynText text="SYSTEM MALFUNCTION" /></strong>
                                <span style={{ opacity: 0.8, fontWeight: 500 }}><DynText text={error} /></span>
                            </div>
                        </div>
                    )}

                    {!curAdvisory && !loading && (
                        <div className="agri-card" style={{ padding: '8rem 4rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'rgba(5, 150, 105, 0.05)', border: '1px solid rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
                                <Sprout size={48} className="agri-green" />
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#1e293b' }}><DynText text="Terminal Standby" /></h3>
                            <p style={{ opacity: 0.5, maxWidth: '450px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, color: '#64748b' }}><DynText text="Synchronize your regional telemetry to generate precision-grade agricultural benchmarks and risk assessments." /></p>
                        </div>
                    )}

                    {(curAdvisory || loading) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Weather Header */}
                            <div className="agri-card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '32px' }}>
                                <div style={{ display: 'flex', gap: '4rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '0.8rem', letterSpacing: '2px', fontWeight: 900 }}>PRECISION TEMP</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-1px' }}>
                                            <Thermometer size={32} className="agri-green" />
                                            {loading ? '---' : Math.round(curAdvisory?.weather_data?.main?.temp || 0)}°C
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '0.8rem', letterSpacing: '2px', fontWeight: 900 }}><DynText text="RELATIVE HUMIDITY" /></p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-1px' }}>
                                            <Droplets size={32} className="agri-green" />
                                            {loading ? '---' : curAdvisory?.weather_data?.main?.humidity}%
                                        </div>
                                    </div>
                                    <div style={{ display: 'none' }}>
                                        {/* Hidden column to maintain grid on mobile if needed */}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div style={{ 
                                        padding: '0.8rem 1.8rem', 
                                        borderRadius: '14px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '900',
                                        background: curAdvisory?.accuracy_meta?.season_match ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        color: curAdvisory?.accuracy_meta?.season_match ? '#10b981' : '#f87171',
                                        border: `1px solid ${curAdvisory?.accuracy_meta?.season_match ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                        letterSpacing: '1px'
                                    }}>
                                        {curAdvisory?.accuracy_meta?.season_match ? <DynText text="✓ AGRI-SYNC ACTIVE" /> : <DynText text="⚠ SEASON MISMATCH" />}
                                    </div>
                                    <div style={{ 
                                        padding: '0.8rem 1.8rem', 
                                        borderRadius: '14px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '900',
                                        background: getRiskColor(curAdvisory?.risk_level) + '15',
                                        color: getRiskColor(curAdvisory?.risk_level),
                                        border: `1px solid ${getRiskColor(curAdvisory?.risk_level)}40`,
                                        letterSpacing: '1px'
                                    }}>
                                        <DynText text={loading ? 'CALCULATING...' : `RISK INDEX: ${curAdvisory?.risk_level}`} />
                                    </div>
                                </div>
                            </div>


                            {/* Advisory Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="agri-card" style={{ height: '140px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '24px', opacity: 0.3 }}></div>)
                                ) : (
                                    curAdvisory?.advisory.map((item, idx) => (
                                        <div key={idx} className="agri-card hover-bg" style={{ padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', background: '#ffffff', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                            <div style={{ 
                                                width: '72px', 
                                                height: '72px', 
                                                borderRadius: '20px', 
                                                background: '#f8fafc', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                fontSize: '2.4rem',
                                                border: '1px solid rgba(0,0,0,0.06)',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                                            }}>
                                                {item.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ color: '#1e293b', fontSize: '1.3rem', marginBottom: '0.6rem', fontWeight: '800', letterSpacing: '-0.3px' }}>
                                                    <DynText text={item.title.toUpperCase()} />
                                                </h4>
                                                <p style={{ fontSize: '1.05rem', color: '#64748b', opacity: 0.8, lineHeight: 1.7, fontWeight: 500 }}>
                                                    <DynText text={item.message} />
                                                </p>
                                            </div>
                                            <ChevronRight size={24} style={{ opacity: 0.2 }} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* HISTORY LIST */}
                    <div className="agri-card" style={{ padding: '3rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
                            <History size={24} className="agri-green" /> <DynText text="Smart Activity Pulse" />
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {history.length > 0 ? history.map((h) => (
                                <div key={h.id} className="history-item" style={{ 
                                    padding: '1.8rem', 
                                    borderRadius: '24px', 
                                    background: '#f8fafc',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
                                        <div style={{ 
                                            width: '8px', 
                                            height: '45px', 
                                            background: getRiskColor(h.risk_level), 
                                            borderRadius: '8px',
                                            boxShadow: `0 0 15px ${getRiskColor(h.risk_level)}30`
                                        }}></div>
                                        <div>
                                            <p style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1e293b', letterSpacing: '-0.2px' }}><DynText text={h.crop} /> <span style={{ opacity: 0.2, fontWeight: '400', margin: '0 0.8rem' }}>/</span> <span style={{ opacity: 0.5 }}><DynText text={h.stage.toUpperCase()} /></span></p>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
                                                <Calendar size={14} /> {new Date(h.created_at).toLocaleDateString()}
                                                <MapPin size={14} /> <DynText text={h.location} />
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px' }}>
                                            {Math.round(h.weather_data?.main?.temp || h.weather_data?.temp || 0)}°C
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: getRiskColor(h.risk_level), fontWeight: '900', letterSpacing: '1px', marginTop: '4px' }}>
                                            <DynText text={h.risk_level} /> <DynText text="RISK" />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', opacity: 0.4, padding: '5rem 2rem', border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                                    <Calendar size={48} style={{ marginBottom: '1.5rem', color: '#64748b' }} />
                                    <p style={{fontWeight: 800, letterSpacing: '1px', color: '#64748b'}}><DynText text="NO ARCHIVED TELEMETRY" /></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropAdvisoryPage;
