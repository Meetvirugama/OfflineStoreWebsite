import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Store, Loader2, AlertCircle, LayoutGrid, Map as MapIcon, ChevronRight } from 'lucide-react';
import apiClient from '@core/api/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // While we have CDN, this is good for consistency
import '@/styles/agriIntelligence.css';

// Default center (Gujarat, India)
const fallbackCenter = [22.2587, 71.1924];

/**
 * CUSTOM ICONS FOR LEAFLET
 * Using DivIcon for more flexibility with colors
 */
const userIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const mandiIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Helper component to pan/zoom when active marker changes
const MapRecenter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom || 13, { animate: true });
    }, [center, zoom, map]);
    return null;
};

const NearbyMandisPage = () => {
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [mandis, setMandis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeMandi, setActiveMandi] = useState(null);

    // 1. Geolocation Logic
    const locateUser = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(loc);
                    fetchNearbyMandis(loc[0], loc[1]);
                },
                (err) => {
                    console.warn("Geolocation blocked.");
                    setUserLocation(fallbackCenter);
                    fetchNearbyMandis(fallbackCenter[0], fallbackCenter[1]);
                    setError("Location access denied. Using default region.");
                }
            );
        } else {
            setError("Geolocation not supported.");
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const results = await apiClient.get(`/mandi/search?q=${searchQuery}`);
            if (results && results.length > 0) {
                const first = results[0];
                const loc = [first.lat, first.lng];
                setUserLocation(loc); // Move "center" to searched location
                fetchNearbyMandis(loc[0], loc[1]);
            } else {
                setError("Locality not found. Try searching for a district name.");
                setLoading(false);
            }
        } catch (err) {
            setError("Search service unavailable.");
            setLoading(false);
        }
    };

    const fetchNearbyMandis = async (lat, lng) => {
        try {
            const res = await apiClient.get(`/mandi/nearby?lat=${lat}&lng=${lng}`);
            setMandis(Array.isArray(res) ? res : []);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch nearby mandis.");
            setLoading(false);
        }
    };

    useEffect(() => {
        locateUser();
    }, []);

    return (
        <div className="agri-page" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* HEADER & TOGGLE */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#10b98120', padding: '10px', borderRadius: '15px' }}>
                            <MapPin className="agri-green" size={28} />
                        </div>
                        Nearby Mandi Finder
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '5px', fontWeight: 500 }}>Find the best rates at marketplaces within 50km of your location.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: 'white', padding: '10px 15px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: 1, maxWidth: '500px' }}>
                    <input 
                        type="text" 
                        placeholder="Search specific district or town..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', fontWeight: 500 }}
                    />
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                        {loading ? <Loader2 className="spin" size={16} /> : 'Search'}
                    </button>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <button 
                        onClick={() => setViewMode('map')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: viewMode === 'map' ? 'white' : 'transparent',
                            color: viewMode === 'map' ? '#10b981' : '#64748b',
                            boxShadow: viewMode === 'map' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                        }}
                    >
                        <MapIcon size={18} /> Map
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: viewMode === 'list' ? 'white' : 'transparent',
                            color: viewMode === 'list' ? '#10b981' : '#64748b',
                            boxShadow: viewMode === 'list' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                        }}
                    >
                        <LayoutGrid size={18} /> List
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '16px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                    <AlertCircle size={20} />
                    <span style={{ fontWeight: 600 }}>{error}</span>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'map' ? '1fr 350px' : '1fr', gap: '25px', height: 'calc(100vh - 250px)', minHeight: '600px' }}>
                
                {/* PART 1: MAP AND LIST CONTAINER */}
                <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', display: viewMode === 'map' ? 'block' : 'none' }}>
                    {loading && (
                        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader2 className="spin" size={48} color="#10b981" />
                        </div>
                    )}
                    
                    <MapContainer center={userLocation || fallbackCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        
                        {/* RECENTER LOGIC */}
                        <MapRecenter center={activeMandi ? [activeMandi.lat, activeMandi.lng] : (userLocation || fallbackCenter)} />

                        {userLocation && (
                            <Marker position={userLocation} icon={userIcon}>
                                <Popup>Your Current Location</Popup>
                            </Marker>
                        )}

                        {mandis.map((m) => (
                            <Marker 
                                key={m.id || `${m.lat}-${m.lng}`} 
                                position={[m.lat, m.lng]} 
                                icon={mandiIcon}
                                eventHandlers={{ click: () => setActiveMandi(m) }}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 800 }}>{m.name}</h4>
                                        <p style={{ margin: 0, color: '#10b981', fontWeight: 700 }}>₹{m.modal_price} <span style={{fontSize: '10px', color: '#64748b'}}>(Avg)</span></p>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#64748b' }}>{m.distance} km away</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* PART 2: THE MANDI LIST (Cards) */}
                <div style={{ 
                    overflowY: 'auto', 
                    padding: viewMode === 'list' ? '0' : '10px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px',
                    gridColumn: viewMode === 'list' ? '1' : 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                            {viewMode === 'map' ? 'Discovery Summary' : 'Nearby Markets'}
                        </h3>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', background: '#10b98110', padding: '4px 10px', borderRadius: '8px' }}>
                            {mandis.length} FOUND
                        </span>
                    </div>

                    {mandis.length === 0 && !loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            <Store size={48} style={{ margin: '0 auto 15px', opacity: 0.2 }} />
                            <p>No markets detected within range.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: viewMode === 'list' ? 'grid' : 'flex', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            flexDirection: 'column',
                            gap: '15px' 
                        }}>
                            {mandis.map((m) => (
                                <div 
                                    key={m.id || `${m.lat}-${m.lng}`}
                                    onClick={() => {
                                        setActiveMandi(m);
                                        if (viewMode === 'list') setViewMode('map');
                                    }}
                                    style={{
                                        background: activeMandi?.name === m.name ? '#f0fdf4' : 'white',
                                        border: activeMandi?.name === m.name ? '1px solid #10b981' : '1px solid #e2e8f0',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: '0.2s',
                                        position: 'relative'
                                    }}
                                    className="hover-shadow"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '12px' }}>
                                            <Store size={20} color="#10b981" />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
                                            {m.distance} KM
                                        </span>
                                    </div>
                                    
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{m.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', fontWeight: 600 }}>Top Crop: <span style={{color: '#1e293b'}}>{m.top_crop || 'Mixed'}</span></p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Avg Rate</p>
                                            <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', margin: 0 }}>₹{m.modal_price}</p>
                                        </div>
                                        <ChevronRight size={20} color="#cbd5e1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FLOATING ACTION BUTTON RE-INDEX */}
            <button 
                onClick={locateUser}
                disabled={loading}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '50px',
                    border: 'none',
                    fontWeight: 800,
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 2000,
                    transition: '0.3s'
                }}
                className={loading ? 'opacity-50' : 'hover-scale'}
            >
                {loading ? <Loader2 className="spin" size={20} /> : <Navigation size={20} />}
                RE-INDEX MARKETS
            </button>
        </div>
    );
};

export default NearbyMandisPage;
