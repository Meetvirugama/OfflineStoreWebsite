import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation, Store, Star, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@core/api/client';
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
                    setError("Location access denied. Displaying default agricultural region.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    };

    // 2. Fetch Mandis from Backend
    const fetchNearbyMandis = async (lat, lng) => {
        try {
            const { data } = await apiClient.get(`/mandis/nearby?lat=${lat}&lng=${lng}&radius=30000`);
            setMandis(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch nearby mandis.");
            setLoading(false);
        }
    };

    useEffect(() => {
        locateUser(); // Auto trigger on mount
    }, []);

    return (
        <div className="agri-page">
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="agri-title" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <MapPin className="agri-green" size={32} /> Nearby APMC Mandis
                    </h1>
                    <p style={{ opacity: 0.6 }}>Dynamically discover active agricultural markets in your region.</p>
                </div>
                <button 
                    onClick={locateUser} 
                    className="agri-card"
                    style={{ 
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                        color: '#fff', 
                        padding: '0.8rem 1.5rem', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? <Loader2 className="spin" size={18} /> : <Navigation size={18} />} 
                    Find Near Me
                </button>
            </div>

            {error && (
                <div className="agri-card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <AlertCircle size={20} />
                    <span style={{ fontSize: '0.9rem' }}>{error}</span>
                </div>
            )}

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '2rem', alignItems: 'start' }}>
                
                {/* LIST VIEW */}
                <div className="agri-card" style={{ padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        Local Markets ({mandis.length})
                    </h3>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                            <Loader2 className="spin" size={32} style={{ margin: '0 auto 1rem' }} />
                            <p>Scanning Region...</p>
                        </div>
                    ) : mandis.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mandis.map((mandi) => (
                                <div 
                                    key={mandi.id} 
                                    onClick={() => {
                                        setActiveMarker(mandi);
                                        map.panTo(mandi.location);
                                        map.setZoom(14);
                                    }}
                                    style={{ 
                                        padding: '1rem', 
                                        borderRadius: '0.8rem', 
                                        background: activeMarker?.id === mandi.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                                        border: activeMarker?.id === mandi.id ? '1px solid #10b981' : '1px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Store size={16} className="agri-green" /> {mandi.name}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>{mandi.address}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                        {mandi.rating && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                                                <Star size={12} fill="currentColor" /> {mandi.rating} ({mandi.user_ratings_total})
                                            </span>
                                        )}
                                        {mandi.isOpen !== null && (
                                            <span style={{ color: mandi.isOpen ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                                {mandi.isOpen ? "🟢 OPEN NOW" : "🔴 CLOSED"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem 0' }}>No agriculture markets found in a 30km radius.</p>
                    )}
                </div>

                {/* MAP VIEW */}
                <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={userLocation || fallbackCenter}
                            zoom={10}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                styles: [
                                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
                                ]
                            }}
                        >
                            {/* USER MARKER */}
                            {userLocation && (
                                <Marker 
                                    position={userLocation} 
                                    icon={{
                                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    }}
                                />
                            )}

                            {/* MANDI MARKERS */}
                            {mandis.map((mandi) => (
                                <Marker
                                    key={mandi.id}
                                    position={mandi.location}
                                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                                    onClick={() => setActiveMarker(mandi)}
                                />
                            ))}

                            {/* INFO WINDOW */}
                            {activeMarker && (
                                <InfoWindow
                                    position={activeMarker.location}
                                    onCloseClick={() => setActiveMarker(null)}
                                >
                                    <div style={{ color: '#000', padding: '0.5rem', maxWidth: '200px' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.2rem' }}>{activeMarker.name}</h4>
                                        <p style={{ fontSize: '0.8rem', margin: '0' }}>{activeMarker.address}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    ) : (
                        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <Loader2 className="spin" size={32} color="#10b981" />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default NearbyMandisPage;
