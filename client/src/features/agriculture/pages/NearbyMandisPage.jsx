import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation, Store, Star, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@core/api/client';
import DynText from '@core/i18n/DynText';
import '@/styles/agriIntelligence.css';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '1rem'
};

// Default center (Gujarat, India if Location blocked)
const fallbackCenter = { lat: 22.2587, lng: 71.1924 };

const NearbyMandisPage = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mandis, setMandis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeMarker, setActiveMarker] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // 1. Get User Location
    const locateUser = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(loc);
                    fetchNearbyMandis(loc.lat, loc.lng);
                },
                (err) => {
                    console.warn("Geolocation blocked, using fallback location.");
                    setUserLocation(fallbackCenter);
                    fetchNearbyMandis(fallbackCenter.lat, fallbackCenter.lng);
                    setError(<DynText text="Location access denied. Displaying default agricultural region." />);
                }
            );
        } else {
            setError(<DynText text="Geolocation is not supported by this browser." />);
            setLoading(false);
        }
    };

    const fetchNearbyMandis = async (lat, lng) => {
        try {
            const res = await apiClient.get(`/mandi/nearby?lat=${lat}&lng=${lng}&radius=30000`);
            setMandis(Array.isArray(res) ? res : []);
            setLoading(false);
        } catch (err) {
            setError(<DynText text="Failed to fetch nearby mandis." />);
            setLoading(false);
        }
    };

    useEffect(() => {
        locateUser(); // Auto trigger on mount
    }, []);

    return (
        <div className="agri-page">
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 className="agri-title" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px' }}>
                        <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                            <MapPin className="agri-green" size={32} />
                        </div>
                        <DynText text="Mandi NearBy Hub" />
                    </h1>
                    <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '0.8rem', fontWeight: 500 }}><DynText text="Spatial indexing of certified agricultural marketplaces and real-time trade hubs." /></p>
                </div>
                <button 
                    onClick={locateUser} 
                    className="agri-card hover-bg"
                    style={{ 
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                        color: '#fff', 
                        padding: '1.2rem 2.5rem', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 800,
                        borderRadius: '20px',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                        fontSize: '1rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    {loading ? <Loader2 className="spin" size={20} /> : <Navigation size={20} />} 
                    <DynText text="RE-INDEX ADJACENT MARKETS" />
                </button>
            </div>

            {error && (
                <div className="agri-card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '3rem', borderRadius: '24px' }}>
                    <AlertCircle size={24} />
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}><DynText text={error} /></span>
                </div>
            )}

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '2.5rem', alignItems: 'start' }}>
                
                {/* LIST VIEW */}
                <div className="agri-card" style={{ padding: '2.5rem', maxHeight: '700px', overflowY: 'auto', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem'}}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1e293b' }}><DynText text="Active Terminals" /></h3>
                        <span style={{background: 'rgba(16, 185, 129, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--agri-green)'}}>{mandis.length} <DynText text="DETECTED" /></span>
                    </div>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.3 }}>
                            <Loader2 className="spin" size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--agri-green)' }} />
                            <p style={{fontWeight: 700, letterSpacing: '2px', fontSize: '0.8rem'}}><DynText text="SCANNING TELEMETRY" />...</p>
                        </div>
                    ) : mandis.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {mandis.map((mandi) => (
                                <div 
                                    key={mandi.id} 
                                    onClick={() => {
                                        setActiveMarker(mandi);
                                        if (window.google && map) {
                                            map.panTo(mandi.location);
                                            map.setZoom(15);
                                        }
                                    }}
                                    style={{ 
                                        padding: '1.8rem', 
                                        borderRadius: '24px', 
                                        background: activeMarker?.id === mandi.id ? 'rgba(16, 185, 129, 0.08)' : '#f8fafc',
                                        border: activeMarker?.id === mandi.id ? '1px solid var(--agri-green)' : '1px solid rgba(0,0,0,0.06)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {activeMarker?.id === mandi.id && (
                                        <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--agri-green)'}}></div>
                                    )}
                                    <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <Store size={20} className="agri-green" /> <DynText text={mandi.name} />
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.5, fontWeight: 500 }}><DynText text={mandi.address} /></p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {mandi.rating ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                                                <Star size={14} fill="#f59e0b" color="#f59e0b" /> 
                                                <Star size={14} fill="#f59e0b" color="#f59e0b" /> 
                                                <span style={{fontWeight: 900, color: '#f59e0b', fontSize: '0.85rem'}}>{mandi.rating}</span>
                                                <span style={{color: '#92400e', opacity: 0.5, fontSize: '0.8rem'}}>({mandi.user_ratings_total})</span>
                                            </div>
                                        ) : <div></div>}
                                        {mandi.isOpen !== null && (
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: 900, 
                                                padding: '0.4rem 1rem', 
                                                borderRadius: '8px', 
                                                background: mandi.isOpen ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: mandi.isOpen ? '#10b981' : '#f87171',
                                                border: `1px solid ${mandi.isOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                letterSpacing: '1px'
                                            }}>
                                                <DynText text={mandi.isOpen ? "OPEN ACCESS" : "CLOSED"} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.4 }}>
                            <p style={{fontSize: '1rem', fontWeight: 600}}><DynText text="No adjacent marketplaces found." /></p>
                        </div>
                    )}
                </div>

                {/* MAP VIEW */}
                <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', background: '#f1f5f9' }}>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '700px' }}
                            center={userLocation || fallbackCenter}
                            zoom={11}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                styles: [], // standard light theme
                                disableDefaultUI: false,
                                zoomControl: true,
                            }}
                        >
                            {/* USER MARKER */}
                            {userLocation && window.google && (
                                <Marker 
                                    position={userLocation} 
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 10,
                                        fillColor: "#3b82f6",
                                        fillOpacity: 1,
                                        strokeWeight: 4,
                                        strokeColor: "white",
                                    }}
                                />
                            )}

                            {/* MANDI MARKERS */}
                            {mandis.map((mandi) => (
                                <Marker
                                    key={mandi.id}
                                    position={mandi.location}
                                    icon={window.google ? {
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 8,
                                        fillColor: "#10b981",
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: "white",
                                    } : undefined}
                                    onClick={() => setActiveMarker(mandi)}
                                />
                            ))}

                            {/* INFO WINDOW */}
                            {activeMarker && (
                                <InfoWindow
                                    position={activeMarker.location}
                                    onCloseClick={() => setActiveMarker(null)}
                                >
                                    <div style={{ color: '#0f172a', padding: '1rem', minWidth: '220px' }}>
                                        <h4 style={{ margin: '0 0 0.8rem 0', borderBottom: '2px solid #10b981', paddingBottom: '0.4rem', fontWeight: 900, fontSize: '1.1rem' }}><DynText text={activeMarker.name} /></h4>
                                        <p style={{ fontSize: '0.9rem', margin: '0', fontWeight: 600, opacity: 0.8 }}><DynText text={activeMarker.address} /></p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    ) : (
                        <div style={{ height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <Loader2 className="spin" size={48} color="#10b981" />
                        </div>
                    )}
                </div>

            </div>
        </div>

    );
};

export default NearbyMandisPage;
