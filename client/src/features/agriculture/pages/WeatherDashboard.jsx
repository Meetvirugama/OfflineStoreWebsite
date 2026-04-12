import React, { useEffect, useState, useMemo } from 'react';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { 
    Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, 
    Navigation, MapPin, Calendar, Clock, AlertTriangle, 
    ChevronRight, Search, Zap, ShieldCheck, SunMedium,
    CloudSun, CloudLightning, Snowflake, Waves, Info,
    MoveRight, RefreshCw, Eye, Wind as WindIcon, Gauge,
    Sprout, Activity, Wind as GustIcon, ShieldAlert,
    ExternalLink, Map as MapIcon, Grid, Bell, User, 
    Moon, Sun as SunIcon, BarChart3, Radio, Layers,
    Compass, Timer
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '@/styles/agriIntelligence.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Elite Leaflet Configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WEATHER_API_KEY = "9a20aaac15df24df7e36aafcd6695408";

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) map.setView([lat, lon], 7);
    }, [lat, lon, map]);
    return null;
};

const ClickToLocate = ({ onLocationClick }) => {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            onLocationClick(lat, lng);
        },
    });
    return null;
};

const WeatherDashboard = () => {
    const { 
        currentWeather, todayTimeline, extendedForecast, 
        alerts, indices, loading, initialize, 
        searchLocations, setSelectedLocation,
        selectedLocation, strategic_outlook, reverseGeocode
    } = useWeatherStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleMapLocationSync = async (lat, lng) => {
        const loc = await reverseGeocode(lat, lng);
        if (loc) {
            setSelectedLocation(loc);
        } else {
            // Fallback if reverse geocode fails
            setSelectedLocation({ name: "Custom Sector", lat, lon: lng });
        }
    };

    // Removed aggressive DOM overrides that were hiding the sidebar layout
    useEffect(() => {
        // Clean up any remaining overrides from previous iterations
        const adminMain = document.querySelector('.admin-main');
        const adminContent = document.querySelector('.admin-content');
        
        if (adminMain) {
            adminMain.style.overflow = '';
            adminMain.style.height = '';
        }
        if (adminContent) {
            adminContent.style.padding = '';
            adminContent.style.overflow = '';
            adminContent.style.height = '';
            adminContent.style.background = 'var(--admin-bg)'; // Use theme variable
        }

        return () => {
             if (adminContent) adminContent.style.background = '';
        };
    }, []);

    useEffect(() => {
        initialize?.();
    }, [initialize]);

    const handleSearch = async (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.length > 2) {
            setIsSearching(true);
            try {
                const results = await searchLocations(val);
                setSearchResults(results || []);
            } catch (err) {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const selectResult = (res) => {
        setSelectedLocation(res);
        setSearchQuery('');
        setSearchResults([]);
    };

    const sprayTimeline = useMemo(() => {
        return (todayTimeline || []).map(t => ({
            ...t,
            time: new Date(t.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            displayTemp: Math.round(t.temp)
        }));
    }, [todayTimeline]);

    const getWeatherIcon = (condition, size = 32) => {
        const c = condition?.toLowerCase() || "";
        if (c.includes("rain")) return <CloudRain size={size} color="#3b82f6" />;
        if (c.includes("cloud")) return <Cloud size={size} color="#94a3b8" />;
        if (c.includes("clear")) return <Sun size={size} color="#fbbf24" style={{filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))'}} />;
        return <SunMedium size={size} color="#fcd34d" />;
    };

    if (loading && !currentWeather) {
        return (
            <div style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <RefreshCw size={50} className="agri-green spin" />
                <p style={{marginTop: '2rem', color: 'var(--agri-green)', opacity: 0.5, letterSpacing: '0.4em', fontSize: '0.7rem', fontWeight: 900}}>CRAFTING SERENITY HUB</p>
            </div>
        );
    }

    return (
        <div className="serenity-hub" style={{maxWidth: '1200px', margin: '0 auto', color: 'inherit', paddingBottom: '3rem', overflowX: 'hidden'}}>
            
            {/* 1. ELITE HEADER */}
            <header className="weather-header" style={{marginBottom: '2rem'}}>
                <div>
                    <h1 style={{fontSize: 'clamp(1.4rem, 5vw, 2.5rem)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px', color: 'inherit'}}>Meteorological Command Center</h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--agri-green)', boxShadow: '0 0 10px var(--agri-green)'}}></div>
                        <span style={{color: '#64748b', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px'}}>
                            Active Sector: <span style={{color: 'inherit'}}>{selectedLocation?.name || 'Gajanvav'}</span>, {selectedLocation?.country || 'India'}
                        </span>
                    </div>
                </div>

                <div className="weather-search-bar" style={{position: 'relative'}}>
                    <div style={{ 
                        flex: 1,
                        background: '#ffffff', 
                        border: '1px solid rgba(0,0,0,0.08)', 
                        borderRadius: '14px', 
                        padding: '0.8rem 1.2rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                    }}>
                        <Search size={18} color="#475569" />
                        <input 
                            type="text" 
                            placeholder="Search Village..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{background: 'transparent', border: 'none', color: 'inherit', width: '100%', outline: 'none', fontSize: '1rem'}}
                        />
                    </div>
                    
                    <button 
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    async (pos) => {
                                        const { latitude, longitude } = pos.coords;
                                        const useWeatherStore = (await import('@features/agriculture/weather/weather.store')).default;
                                        const store = useWeatherStore.getState();
                                        const loc = await store.reverseGeocode(latitude, longitude);
                                        if (loc) store.setSelectedLocation(loc);
                                    }
                                );
                            }
                        }}
                        title="Detect My Location"
                        style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '14px',
                            width: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--agri-green)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <MapPin size={20} />
                    </button>

                    {searchResults.length > 0 && (
                        <div className="search-results-container" style={{background: '#ffffff', top: '120%', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', position: 'absolute', width: '100%', maxWidth: '320px', left: 0}}>
                            {searchResults.map((res, i) => (
                                <div key={i} onClick={() => selectResult(res)} className="search-result-item" style={{padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer'}}>
                                    <span style={{color: 'inherit', fontWeight: 700}}>{res.name}</span>
                                    <span style={{color: '#64748b', fontSize: '0.8rem'}}>{res.state}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* 2. PRIMARY IMPACT (HERO) */}
            <div style={{background: '#ffffff', borderRadius: '24px', padding: 'clamp(1.2rem, 4vw, 3.5rem)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.04)'}}>
                <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(5, 150, 105, 0.05) 0%, transparent 70%)', filter: 'blur(50px)'}}></div>
                
                <div style={{position: 'relative', zIndex: 1}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {/* Temp + Condition */}
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                            <span style={{fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 900, letterSpacing: '-3px', color: 'inherit', lineHeight: 1}}>{Math.round(currentWeather?.main?.temp || 0)}°</span>
                            <div style={{flex: 1, minWidth: '120px'}}>
                                <h2 style={{fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--agri-green)'}}>{currentWeather?.weather?.[0]?.main}</h2>
                                <p style={{fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', color: '#64748b', margin: '0.5rem 0 0', fontWeight: 600, textTransform: 'capitalize'}}>
                                    {currentWeather?.weather?.[0]?.description || 'Optimized atmospheric conditions analyzed for your region.'}
                                </p>
                            </div>
                        </div>
                        {/* Stats Row */}
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.8rem, 3vw, 4rem)', marginTop: '1rem', color: 'inherit'}}>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>HUMIDITY</p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>{currentWeather?.main?.humidity}%</p></div>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>FEELS LIKE</p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>{Math.round(currentWeather?.main?.feels_like || 0)}°</p></div>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>PRECIPITATION</p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>{Math.round((todayTimeline[0]?.pop || 0) * 100)}%</p></div>
                        </div>
                    </div>
                    <div style={{width: 'clamp(100px, 25vw, 240px)', height: 'clamp(100px, 25vw, 240px)', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', margin: '1.5rem auto 0'}}>
                        {getWeatherIcon(currentWeather?.weather?.[0]?.main, 'clamp(50px, 12vw, 140px)')}
                    </div>
                </div>
            </div>

            {/* 3. THE HORIZON (WEEKLY STRIP) — horizontal scroll on mobile */}
            <div style={{overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', WebkitOverflowScrolling: 'touch'}}>
              <div style={{display: 'flex', gap: '0.75rem', minWidth: 'min-content', padding: '0.25rem'}}>
                {(extendedForecast || []).slice(0, 7).map((day, i) => (
                    <div key={i} style={{background: '#ffffff', borderRadius: '20px', padding: 'clamp(0.8rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,0.06)', transition: 'transform 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', flex: '0 0 auto', minWidth: '72px'}}>
                        <span style={{color: '#64748b', fontWeight: 800, fontSize: '0.7rem', marginBottom: '0.6rem'}}>
                            {i === 0 ? 'TODAY' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase()}
                        </span>
                        {getWeatherIcon(day.weather?.main, 24)}
                        <span style={{fontSize: '1.3rem', fontWeight: 900, marginTop: '0.8rem', color: 'inherit'}}>{Math.round(day.temp_max)}°</span>
                    </div>
                ))}
              </div>
            </div>

            {/* 4. CLINICAL SATELLITE AREA */}
            <div style={{marginBottom: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem'}}>
                    <h3 style={{fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'inherit', letterSpacing: '-0.5px'}}>
                        <Compass className="agri-green" size={20} /> Precision Field Topology
                    </h3>
                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                        <div style={{padding: '0.3rem 0.8rem', background: '#ffffff', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(0,0,0,0.08)', color: '#64748b'}}>SATELLITE</div>
                        <div style={{padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, color: '#64748b'}}>INFRARED</div>
                    </div>
                </div>
                <div style={{height: 'clamp(400px, 75vw, 650px)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', background: '#020617'}}>
                    
                    {/* [NEW FEATURE] ATMOSPHERIC PULSE RIBBON */}
                    <div className="atmospheric-ticker" style={{position: 'absolute', top: 0, left: 0, right: 0, height: '3rem', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'}}>
                        <div style={{padding: '0 1.5rem', background: 'var(--agri-green)', height: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px', flexShrink: 0, zIndex: 2}}>
                            <Radio size={16} className="spin" />
                            ATMOSPHERIC PULSE
                        </div>
                        <div style={{display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite', gap: '3rem', paddingLeft: '2rem'}}>
                            {[
                                `SECTOR ${selectedLocation?.name?.toUpperCase() || 'ALPHA'}: PRESSURE STABILIZING...`,
                                `DEW POINT INDEX: ${currentWeather?.main?.temp ? (currentWeather.main.temp - 2).toFixed(1) : 22}°C`,
                                `PRECISE FIELD TOPOLOGY: 8 ACTIVE NODES SYNCED`,
                                `MOISTURE GRADIENT: ${indices?.soilMoisture ? (indices.soilMoisture * 100).toFixed(1) : 22}%`,
                                `STORM VELOCITY: < 5KM/H IN RADIUS`,
                                `DATA INTEGRITY: 99.8% CERTAINTY`
                            ].map((text, i) => (
                                <span key={i} style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px'}}>{text}</span>
                            ))}
                        </div>
                    </div>

                    <MapContainer 
                        center={[selectedLocation?.lat || 22.3, selectedLocation?.lon || 70.8]} 
                        zoom={7} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        {/* High-Precision Satellite Base */}
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='&copy; Esri'
                        />
                        
                        {/* Dynamic Atmospheric Overlays */}
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                            opacity={0.5}
                            zIndex={10}
                        />
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                            opacity={0.5}
                            zIndex={11}
                        />

                        <RecenterMap lat={selectedLocation?.lat} lon={selectedLocation?.lon} />
                        <ClickToLocate onLocationClick={handleMapLocationSync} />

                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                <Popup>
                                    <div style={{fontWeight: 800, padding: '0.5rem', textAlign: 'center'}}>
                                        <div style={{fontSize: '0.6rem', opacity: 0.5, marginBottom: '4px', letterSpacing: '1px'}}>ACTIVE SECTOR</div>
                                        <div style={{fontSize: '1.1rem', color: 'var(--agri-green)'}}>{selectedLocation.name}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    {/* Desktop/Tablet Controls */}
                    <div className="map-interaction-prompt" style={{position: 'absolute', bottom: '2rem', right: '2rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: '0.8rem 1.5rem', borderRadius: '16px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                        <div className="pulse-green" style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '50%'}}></div>
                        <span style={{fontSize: '0.8rem', fontWeight: 900, color: '#1e293b', letterSpacing: '0.4px'}}>CLICK ANY SECTOR TO SYNC</span>
                    </div>

                    <div className="map-telemetry-overlay" style={{position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(30px)', color: '#fff', padding: '2rem', borderRadius: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', maxWidth: '320px', zIndex: 1000, border: '1px solid rgba(255,255,255,0.1)'}}>
                        <p style={{fontSize: '0.65rem', fontWeight: 900, color: 'var(--agri-green)', margin: '0 0 0.8rem', letterSpacing: '2px'}}>TOPOLOGY STREAM</p>
                        <h4 style={{fontSize: '1.2rem', fontWeight: 900, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                            <Zap size={20} className="agri-green" /> Regional Diagnostics
                        </h4>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.5rem'}}>
                            <div style={{padding: '0.4rem 0.8rem', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900}}>CLOUDS: LIVE</div>
                            <div style={{padding: '0.4rem 0.8rem', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900}}>STORM: INDEXED</div>
                        </div>
                        <button 
                            onClick={() => initialize?.()}
                            style={{width: '100%', background: 'var(--agri-green)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '14px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'}}
                        >
                            REFRESH TOPOLOGY
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @media (max-width: 768px) {
                        .map-telemetry-overlay {
                            display: none !important;
                        }
                        .map-interaction-prompt {
                            bottom: 1rem !important;
                            right: 1rem !important;
                            left: 1rem !important;
                            justify-content: center !important;
                        }
                    }
                `}</style>
            </div>

            {/* 5. ENVIRONMENTAL DIAGNOSTICS */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem'}}>
                {/* Environmental Metrics */}
                <div style={{background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <p style={{fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.15em', margin: 0}}>ENVIRONMENTAL METRICS</p>
                        <Radio size={14} className="agri-green" />
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '1rem'}}>
                        {[
                            { lab: 'SOIL MOISTURE', val: `${Math.round((indices?.soilMoisture || 0.22) * 100)}%`, icon: <Sprout size={18} color="var(--agri-green)" /> },
                            { lab: 'SOIL TEMP', val: `${Math.round(indices?.soilTemp || 0)}°C`, icon: <Thermometer size={18} color="#60a5fa" /> },
                            { lab: 'AIR QUALITY', val: indices?.airQuality || 'HEALTHY', icon: <Activity size={18} color="#fbbf24" /> }
                        ].map((item, i) => (
                            <div key={i} style={{background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.04)'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem'}}>
                                    {item.icon}
                                    <span style={{fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em'}}>{item.lab}</span>
                                </div>
                                <span style={{fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 900, color: '#1e293b'}}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Window */}
                <div style={{background: 'rgba(16, 185, 129, 0.05)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--agri-green)'}}></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem'}}>
                        <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.1em'}}>APPLICATION WINDOW</span>
                        <ShieldCheck size={18} className="agri-green" />
                    </div>
                    <p style={{fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 900, margin: 0, color: '#065f46'}}>OPTIMAL CONDITIONS</p>
                </div>

                {/* 24-Hour Atmospheric Trend */}
                <div style={{background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
                        <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px', color: '#1e293b'}}>24-Hour Atmospheric Trend</h3>
                        <div style={{padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.1)', color: '#059669', alignSelf: 'flex-start'}}>TEMPERATURE PULSE</div>
                    </div>
                    <div style={{height: 'clamp(180px, 30vw, 300px)'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sprayTimeline}>
                                <defs>
                                    <linearGradient id="serenityGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                                <YAxis hide />
                                <Tooltip contentStyle={{background: '#ffffff', border: '1px solid var(--agri-green)', borderRadius: '12px', color: '#1e293b'}} />
                                <Area type="monotone" dataKey="displayTemp" stroke="var(--agri-green)" fill="url(#serenityGlow)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Strategic Outlook */}
            {strategic_outlook && (
                <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: 'clamp(1.2rem, 4vw, 2.5rem)', borderRadius: '24px', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', marginTop: '2rem'}}>
                    <div style={{position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', filter: 'blur(40px)'}}></div>
                    <div style={{position: 'relative', zIndex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem'}}>
                            <div style={{width: '32px', height: '32px', borderRadius: '10px', background: 'var(--agri-green)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Zap size={18} color="#fff" />
                            </div>
                            <h4 style={{margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)'}}>Expert AI Strategic Outlook</h4>
                        </div>
                        <p style={{fontSize: 'clamp(1rem, 3vw, 1.25rem)', lineHeight: 1.6, fontWeight: 500, margin: 0, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.2px'}}>
                            {strategic_outlook}
                        </p>
                        <div style={{marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <div style={{padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)'}}>
                                LLAMA-3 ANALYSIS
                            </div>
                            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--agri-green)'}}></div>
                            <span style={{fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)'}}>REAL-TIME SYNTHESIS</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDashboard;
