import React, { useState, useEffect, useCallback } from 'react';
import useAdvisoryStore from '@features/agriculture/crop/advisory.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { 
    Sprout, 
    MapPin, 
    Navigation, 
    AlertTriangle, 
    History,
    TrendingUp,
    ShieldCheck,
    Loader2,
    ChevronRight,
    Target,
    RefreshCw
} from 'lucide-react';
import { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup,
    useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Soybean", "Maize"];
const STAGES = ["Sowing", "Vegetative", "Flowering", "Fruiting", "Harvesting"];

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) map.setView([lat, lon], 10);
    }, [lat, lon, map]);
    return null;
};

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

    return (
        <div className="agri-page">
            <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="agri-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                            <Target className="agri-green" size={32} />
                        </div>
                        Smart Mandi Hub + Advisory
                    </h1>
                    <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ShieldCheck size={18} className="agri-green" />
                        AI-powered regional intelligence combining weather and market velocity.
                    </p>
                </div>
                <div className="weather-badge" style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 800, letterSpacing: '1px', fontSize: '0.75rem' }}>
                    {syncStatus === 'SYNCED' ? <ShieldCheck size={16} /> : <RefreshCw size={16} className={syncStatus === 'DETECTING' ? 'spin' : ''} />}
                    {syncStatus === 'SYNCED' ? 'SYSTEM SYNCED' : syncStatus.toUpperCase()}
                </div>
            </header>

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(380px, 420px) 1fr', gap: '3rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
                            <div style={{width: '6px', height: '24px', background: 'var(--agri-green)', borderRadius: '4px'}}></div>
                            Telemetry Parameters
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>IDENTIFIED CROP</label>
                                <select 
                                    value={formData.crop}
                                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                                    style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {CROPS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>GROWTH VELOCITY</label>
                                <select 
                                    value={formData.stage}
                                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                                    style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {STAGES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>SPATIAL CONTEXT</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                        <input 
                                            type="text"
                                            placeholder="City / Village Index"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value, lat: null, lon: null})}
                                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleLocationDetect}
                                        style={{ padding: '0', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', cursor: 'pointer', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                    >
                                        <Navigation size={22} className="agri-green" />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
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
                                {loading ? 'SYNCHRONIZING' : 'INITIALIZE HUB'}
                            </button>
                        </div>
                    </div>

                    <div className="agri-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem', fontWeight: 800 }}>
                            <TrendingUp className="agri-green" size={22} /> AI Risk Assessment
                        </h3>
                        {curAdvisory?.accuracy_meta?.risks_raw ? (
                            curAdvisory.accuracy_meta.risks_raw.map((risk, idx) => (
                                <div key={idx} style={{ padding: '1rem', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '16px', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                                    <AlertTriangle size={18} />
                                    {risk}
                                </div>
                            ))
                        ) : (
                            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                                <p style={{ fontWeight: 800, fontSize: '0.75rem' }}>NO RISKS DETECTED</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {!curAdvisory && !loading && (
                        <div className="agri-card" style={{ padding: '8rem 4rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '40px' }}>
                            <Sprout size={48} className="agri-green" style={{ margin: '0 auto 2.5rem' }} />
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 900 }}>Hub Standby</h3>
                            <p style={{ opacity: 0.5, fontSize: '1.1rem', fontWeight: 500 }}>Synchronize data to unlock AI-powered agronomy.</p>
                        </div>
                    )}

                    {(curAdvisory || loading) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="agri-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: '32px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <ShieldCheck className="agri-green" size={24} /> AI STRATEGIC ADVISORY
                                </h3>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.9 }}>
                                    {loading ? 'Synthesizing data...' : curAdvisory?.accuracy_meta?.ai_text}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="agri-card" style={{ height: '400px', borderRadius: '32px', overflow: 'hidden' }}>
                                    <MapContainer center={[formData.lat || 22.3, formData.lon || 70.8]} zoom={10} style={{ height: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <RecenterMap lat={formData.lat} lon={formData.lon} />
                                        {curAdvisory?.mandis_list?.map((m, idx) => (
                                            <Marker key={idx} position={[m.lat, m.lng]}>
                                                <Popup><div style={{fontWeight: 800}}>{m.name}</div> ₹{m.modal_price}</Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="agri-card" style={{ padding: '2rem', background: '#fff', border: '2px solid var(--agri-green)', borderRadius: '32px' }}>
                                        <div style={{ padding: '0.4rem 0.8rem', background: 'var(--agri-green)', color: '#fff', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, display: 'inline-block', marginBottom: '1rem' }}>BEST OPTION</div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{loading ? '---' : curAdvisory?.best_mandi?.name}</h3>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--agri-green)', margin: '1rem 0' }}>₹{loading ? '---' : curAdvisory?.best_mandi?.modal_price}</div>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{loading ? '---' : curAdvisory?.accuracy_meta?.best_mandi_reason}</p>
                                    </div>

                                    <div className="agri-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', flex: 1, maxHeight: '250px', overflowY: 'auto' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, marginBottom: '1.2rem' }}>REGIONAL APMC NETWORK (50KM)</h4>
                                        {curAdvisory?.mandis_list?.map((m, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{m.name}</span>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 900, color: 'var(--agri-green)' }}>₹{m.modal_price}</div>
                                                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{m.distance} KM</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px' }}>
                                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', fontWeight: 800 }}>
                                    <History className="agri-green" /> Strategic Activity Pulse
                                </h3>
                                {curAdvisory?.advisory?.map((h, idx) => (
                                    <div key={idx} style={{ padding: '1.5rem', borderRadius: '20px', background: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <ChevronRight className="agri-green" />
                                            <div>
                                                <p style={{ fontWeight: '800', color: '#1e293b' }}>{h.message}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--agri-green)', fontWeight: 900 }}>ACTION REQUIRED ● PRIORITY {idx + 1}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropAdvisoryPage;
