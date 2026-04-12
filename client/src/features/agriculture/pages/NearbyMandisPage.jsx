import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
    MapPin, 
    Navigation, 
    Store, 
    Loader2, 
    AlertCircle, 
    LayoutGrid, 
    Map as MapIcon, 
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Search,
    RefreshCw,
    Target
} from 'lucide-react';
import apiClient from '@core/api/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/agriIntelligence.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const fallbackCenter = [22.3, 70.8]; // Morbi/Rajkot region default

const MapRecenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 11, { animate: true });
    }, [center, map]);
    return null;
};

const NearbyMandisPage = () => {
    const [viewMode, setViewMode] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [mandis, setMandis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeMandi, setActiveMandi] = useState(null);

    const fetchNearbyMandis = useCallback(async (lat, lng) => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/mandi/nearby?lat=${lat}&lng=${lng}`);
            setMandis(Array.isArray(res) ? res : []);
            setError(null);
        } catch (err) {
            setError("Connectivity issue: Unable to reach discovery engine.");
        } finally {
            setLoading(false);
        }
    }, []);

    const locateUser = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = [parseFloat(pos.coords.latitude), parseFloat(pos.coords.longitude)];
                    setUserLocation(loc);
                    fetchNearbyMandis(loc[0], loc[1]);
                },
                () => {
                    setUserLocation(fallbackCenter);
                    fetchNearbyMandis(fallbackCenter[0], fallbackCenter[1]);
                    setError("Location precision limited. Using regional default.");
                }
            );
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const results = await apiClient.get(`/mandi/search?q=${searchQuery}`);
            if (results && results.length > 0) {
                const first = results[0];
                const loc = [first.lat, first.lng];
                setUserLocation(loc);
                fetchNearbyMandis(loc[0], loc[1]);
                setActiveMandi(null);
            } else {
                setError("Locality not found in official roster.");
            }
        } catch (err) {
            setError("Search engine maintenance in progress.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        locateUser();
    }, []);

    return (
        <div className="agri-page" style={{ padding: '2rem 3rem', maxWidth: '1600px', margin: '0 auto' }}>
            {/* PREMIUM HEADER SECTION */}
            <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="agri-title" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <Target className="agri-green" size={36} />
                        </div>
                        Official Mandi Explorer
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <ShieldCheck size={20} className="agri-green" />
                        Live High-Precision Discovery for 112+ Official Gujarat Markets.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '8px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                        <button 
                            onClick={() => setViewMode('map')}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', border: 'none', background: viewMode === 'map' ? '#fff' : 'transparent', color: viewMode === 'map' ? 'var(--agri-green)' : '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: viewMode === 'map' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: '0.3s' }}
                        >
                            <MapIcon size={18} /> MAP VIEW
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', border: 'none', background: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? 'var(--agri-green)' : '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: viewMode === 'list' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: '0.3s' }}
                        >
                            <LayoutGrid size={18} /> DIRECTORY
                        </button>
                    </div>
                </div>
            </div>

            {/* INTEGRATED SEARCH & STATUS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', background: '#fff', padding: '1rem 1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <Search size={22} style={{ opacity: 0.3 }} />
                        <input 
                            type="text" 
                            placeholder="Identify Village, District or APMC center..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="agri-button"
                        style={{ padding: '1rem 2.5rem', borderRadius: '16px', background: 'var(--agri-green)', color: '#fff', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                        {loading ? <Loader2 className="spin" size={20} /> : <Navigation size={20} />}
                        {loading ? 'ANALYZING...' : 'DISCOVER MARKETS'}
                    </button>
                </div>

                <div className="agri-card" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, letterSpacing: '1px' }}>SYSTEM PULSE</p>
                        <p style={{ fontWeight: 800, color: 'var(--agri-green)', fontSize: '0.9rem' }}>{loading ? 'SYNCING...' : 'DISCOVERY ACTIVE'}</p>
                    </div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--agri-green)', boxShadow: '0 0 10px var(--agri-green)', animation: 'pulse 2s infinite' }}></div>
                </div>
            </div>

            {error && (
                <div className="agri-card" style={{ padding: '1.5rem 2rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '24px' }}>
                    <AlertCircle size={24} />
                    <div>
                        <p style={{ fontWeight: 900, fontSize: '0.9rem' }}>DISCOVERY ERROR</p>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', opacity: 0.8 }}>{error}</p>
                    </div>
                </div>
            )}

            {/* EXPLORATION GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'map' ? '1fr 450px' : '1fr', gap: '3rem', height: '800px' }}>
                
                {/* INTERACTIVE MAP HUB */}
                <div style={{ borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: viewMode === 'map' ? 'block' : 'none' }}>
                    <MapContainer center={userLocation || fallbackCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapRecenter center={activeMandi ? [activeMandi.lat, activeMandi.lng] : (userLocation || fallbackCenter)} />
                        
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup><div style={{fontWeight: 900}}>Operational Base</div></Popup>
                            </Marker>
                        )}

                        {mandis.map((m) => (
                            <Marker 
                                key={m.id || `${m.lat}-${m.lng}`} 
                                position={[m.lat, m.lng]}
                                eventHandlers={{ click: () => setActiveMandi(m) }}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 900 }}>{m.name}</h4>
                                        <p style={{ margin: 0, color: 'var(--agri-green)', fontWeight: 800 }}>{'₹' + m.modal_price} <span style={{fontSize: '0.7rem', opacity: 0.5}}>(Live)</span></p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* MARKET DIRECTORY / SUMMARY */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>
                            {viewMode === 'map' ? 'Market Intelligence' : 'Regional APMC Network'}
                        </h3>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--agri-green)', borderRadius: '12px', fontWeight: 900, fontSize: '0.8rem' }}>
                            {mandis.length} ACTIVE CLUSTERS
                        </div>
                    </div>

                    <div style={{ 
                        display: viewMode === 'list' ? 'grid' : 'flex', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                        flexDirection: 'column',
                        gap: '1.5rem' 
                    }}>
                        {mandis.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '10rem 4rem', background: '#f8fafc', borderRadius: '40px', border: '2px dashed rgba(0,0,0,0.05)' }}>
                                <Store size={64} style={{ margin: '0 auto 2rem', opacity: 0.1 }} />
                                <h3 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1e293b', marginBottom: '1rem' }}>NO MARKETS IN RANGE</h3>
                                <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '2.5rem', lineHeight: '1.6' }}>We couldn't detect active trading centers within 50km. This can happen in specialized rural corridors.</p>
                                <button 
                                    onClick={locateUser}
                                    className="agri-button"
                                    style={{ padding: '1.2rem 2.5rem', borderRadius: '20px', background: 'var(--agri-green)', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}
                                >
                                    <RefreshCw size={20} /> BROADEN DISCOVERY SCALE
                                </button>
                            </div>
                        )}

                        {mandis.map((m) => (
                            <div 
                                key={m.id || `${m.lat}-${m.lng}`}
                                onClick={() => {
                                    setActiveMandi(m);
                                    if (viewMode === 'list') setViewMode('map');
                                }}
                                className="agri-card hover-scale"
                                style={{
                                    padding: '2.5rem',
                                    background: activeMandi?.name === m.name ? 'rgba(16, 185, 129, 0.03)' : '#fff',
                                    border: activeMandi?.name === m.name ? '2px solid var(--agri-green)' : '1px solid rgba(0,0,0,0.06)',
                                    borderRadius: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
                                        <Store className="agri-green" size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                                        {m.distance} KM AWAY
                                    </span>
                                </div>
                                
                                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.8rem' }}>{m.name}</h4>
                                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--agri-green)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                        OFFICIAL APMC
                                    </span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#f1f5f9', color: '#64748b', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                        {m.district || 'Market Yard'}
                                    </span>
                                </div>
                                
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}>MARKET VOLUME</p>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.modal_price > 0 ? 'var(--agri-green)' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {m.modal_price > 0 ? ("₹" + m.modal_price) : 'RATE PENDING'}
                                                {m.modal_price > 0 && <TrendingUp size={24} />}
                                            </div>
                                            {m.modal_price === 0 && (
                                                <p style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, marginTop: '4px' }}>Official daily update awaited...</p>
                                            )}
                                        </div>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChevronRight color="#cbd5e1" size={24} />
                                        </div>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FLOATING OPERATIONAL BASE BUTTON */}
            <button 
                onClick={locateUser}
                disabled={loading}
                className="agri-button-pulse"
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    padding: '1.5rem 3.5rem',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1rem',
                    boxShadow: '0 15px 40px rgba(16, 185, 129, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    zIndex: 1000,
                    transition: '0.3s'
                }}
            >
                {loading ? <RefreshCw className="spin" size={24} /> : <Target size={24} />}
                {loading ? 'CALIBRATING...' : 'CENTER ON BASE'}
            </button>
        </div>
    );
};

export default NearbyMandisPage;
