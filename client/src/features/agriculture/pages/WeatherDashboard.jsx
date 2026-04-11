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
} from 'recharts';
import DynText from '@core/i18n/DynText';
import '@/styles/agriIntelligence.css';

const WeatherDashboard = () => {
    const { 
        currentWeather, todayTimeline, extendedForecast, 
        alerts, indices, loading, initialize, 
        searchLocations, setSelectedLocation,
        selectedLocation
    } = useWeatherStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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
                <p style={{marginTop: '2rem', color: 'var(--agri-green)', opacity: 0.5, letterSpacing: '0.4em', fontSize: '0.7rem', fontWeight: 900}}><DynText text="CRAFTING SERENITY HUB" /></p>
            </div>
        );
    }

    return (
        <div className="serenity-hub" style={{maxWidth: '1200px', margin: '0 auto', color: 'inherit', paddingBottom: '3rem', overflowX: 'hidden'}}>
            
            {/* 1. ELITE HEADER */}
            <header className="weather-header" style={{marginBottom: '2rem'}}>
                <div>
                    <h1 style={{fontSize: 'clamp(1.4rem, 5vw, 2.5rem)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px', color: 'inherit'}}><DynText text="Meteorological Command Center" /></h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--agri-green)', boxShadow: '0 0 10px var(--agri-green)'}}></div>
                        <span style={{color: '#64748b', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px'}}>
                            <DynText text="Active Sector" />: <span style={{color: 'inherit'}}><DynText text={selectedLocation?.name || 'Gajanvav'} /></span>, <DynText text={selectedLocation?.country || 'India'} />
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
                            placeholder="Find Village..." 
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
                                <h2 style={{fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--agri-green)'}}><DynText text={currentWeather?.weather?.[0]?.main} /></h2>
                                <p style={{fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', color: '#64748b', margin: '0.5rem 0 0', fontWeight: 600}}><DynText text="Clear skies with optimal humidity levels for harvest." /></p>
                            </div>
                        </div>
                        {/* Stats Row */}
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.8rem, 3vw, 4rem)', marginTop: '1rem', color: 'inherit'}}>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}><DynText text="HUMIDITY" /></p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>{currentWeather?.main?.humidity}%</p></div>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}><DynText text="FEELS LIKE" /></p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>{Math.round(currentWeather?.main?.feels_like || 0)}°</p></div>
                            <div><p style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}><DynText text="PRECIPITATION" /></p><p style={{fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, margin: 0}}>0%</p></div>
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
                            <DynText text={i === 0 ? 'TODAY' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase()} />
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
                        <Compass className="agri-green" size={20} /> <DynText text="Precision Field Topology" />
                    </h3>
                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                        <div style={{padding: '0.3rem 0.8rem', background: '#ffffff', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(0,0,0,0.08)', color: '#64748b'}}><DynText text="SATELLITE" /></div>
                        <div style={{padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, color: '#64748b'}}><DynText text="INFRARED" /></div>
                    </div>
                </div>
                <div style={{height: 'clamp(250px, 50vw, 500px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', position: 'relative'}}>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{border: 0, filter: 'grayscale(0.7) contrast(1.1) brightness(0.8)'}}
                        src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=${selectedLocation?.lat || 22.3039},${selectedLocation?.lon || 70.8022}&zoom=14&maptype=satellite`}
                    ></iframe>
                    <div style={{position: 'absolute', bottom: '1rem', right: '1rem', left: '1rem', background: '#fff', color: '#000', padding: 'clamp(0.8rem, 2vw, 1.5rem)', borderRadius: '16px', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', maxWidth: '250px'}}>
                        <p style={{fontSize: '0.6rem', fontWeight: 900, opacity: 0.5, margin: '0 0 0.3rem'}}><DynText text="FIELD CONNECTED" /></p>
                        <h4 style={{fontSize: '0.95rem', fontWeight: 900, margin: '0 0 0.5rem'}}><DynText text="8 Active Nodes" /></h4>
                        <div style={{display: 'flex', gap: '0.4rem', marginBottom: '0.8rem'}}>
                            {[1,2,3,4,5].map(i => <div key={i} style={{width: '5px', height: '5px', borderRadius: '50%', background: 'var(--agri-green)'}}></div>)}
                        </div>
                        <button style={{width: '100%', background: '#020617', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer'}}><DynText text="SCAN SECTOR" /></button>
                    </div>
                </div>
            </div>

            {/* 5. ENVIRONMENTAL DIAGNOSTICS */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem'}}>
                {/* Environmental Metrics */}
                <div style={{background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <p style={{fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.15em', margin: 0}}><DynText text="ENVIRONMENTAL METRICS" /></p>
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
                                    <span style={{fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em'}}><DynText text={item.lab} /></span>
                                </div>
                                <span style={{fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 900, color: '#1e293b'}}><DynText text={item.val} /></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Window */}
                <div style={{background: 'rgba(16, 185, 129, 0.05)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--agri-green)'}}></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem'}}>
                        <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.1em'}}><DynText text="APPLICATION WINDOW" /></span>
                        <ShieldCheck size={18} className="agri-green" />
                    </div>
                    <p style={{fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 900, margin: 0, color: '#065f46'}}><DynText text="OPTIMAL CONDITIONS" /></p>
                </div>

                {/* 24-Hour Atmospheric Trend */}
                <div style={{background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
                        <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px', color: '#1e293b'}}><DynText text="24-Hour Atmospheric Trend" /></h3>
                        <div style={{padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.1)', color: '#059669', alignSelf: 'flex-start'}}><DynText text="TEMPERATURE PULSE" /></div>
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

        </div>
    );
};

export default WeatherDashboard;
