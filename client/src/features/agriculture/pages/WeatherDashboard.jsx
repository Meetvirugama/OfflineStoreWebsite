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
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Area as AreaPlot
} from 'recharts';
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
            adminContent.style.background = '#020617'; // Set background just for content area
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
                <p style={{marginTop: '2rem', color: '#fff', opacity: 0.3, letterSpacing: '0.4em', fontSize: '0.7rem', fontWeight: 900}}>CRAFTING SERENITY HUB</p>
            </div>
        );
    }

    return (
        <div className="serenity-hub" style={{maxWidth: '1200px', margin: '0 auto', color: '#fff', paddingBottom: '3rem'}}>
            
            {/* 1. ELITE HEADER */}
            <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                <div>
                    <h1 style={{fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px', color: '#fff'}}>Meteorological Command Center</h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--agri-green)', boxShadow: '0 0 10px var(--agri-green)'}}></div>
                        <span style={{color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px'}}>
                            Active Sector: <span style={{color: '#fff'}}>{selectedLocation?.name || 'Gajanvav'}</span>, {selectedLocation?.country || 'India'}
                        </span>
                    </div>
                </div>

                <div style={{position: 'relative', width: '300px'}}>
                    <div style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <Search size={18} color="#475569" />
                        <input 
                            type="text" 
                            placeholder="Find Village..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem'}}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="search-results-container" style={{background: '#0f172a', top: '120%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', zIndex: 100}}>
                            {searchResults.map((res, i) => (
                                <div key={i} onClick={() => selectResult(res)} className="search-result-item" style={{padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                                    <span style={{color: '#fff', fontWeight: 700}}>{res.name}</span>
                                    <span style={{color: '#64748b', fontSize: '0.8rem'}}>{res.state}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* 2. PRIMARY IMPACT (HERO) */}
            <div style={{background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)', borderRadius: '32px', padding: '3.5rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'}}>
                <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(50px)'}}></div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
                    <div>
                        <div style={{display: 'flex', alignItems: 'baseline', gap: '1.5rem'}}>
                            <span style={{fontSize: '9rem', fontWeight: 900, letterSpacing: '-5px', color: '#fff', lineHeight: 1}}>{Math.round(currentWeather?.main?.temp || 0)}°</span>
                            <div>
                                <h2 style={{fontSize: '2.2rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em'}}>{currentWeather?.weather?.[0]?.main}</h2>
                                <p style={{fontSize: '0.9rem', color: '#94a3b8', margin: '0.5rem 0 0', fontWeight: 600}}>Clear skies with optimal humidity levels for harvest.</p>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '4rem', marginTop: '3rem'}}>
                            <div><p style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>HUMIDITY</p><p style={{fontSize: '1.8rem', fontWeight: 900, margin: 0}}>{currentWeather?.main?.humidity}%</p></div>
                            <div><p style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>FEELS LIKE</p><p style={{fontSize: '1.8rem', fontWeight: 900, margin: 0}}>{Math.round(currentWeather?.main?.feels_like || 0)}°</p></div>
                            <div><p style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 800, margin: 0, letterSpacing: '0.1em'}}>PRECIPITATION</p><p style={{fontSize: '1.8rem', fontWeight: 900, margin: 0}}>0%</p></div>
                        </div>
                    </div>
                    <div style={{width: '240px', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'}}>
                        {getWeatherIcon(currentWeather?.weather?.[0]?.main, 140)}
                    </div>
                </div>
            </div>

            {/* 3. THE HORIZON (WEEKLY STRIP) */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1.2rem', marginBottom: '2.5rem'}}>
                {(extendedForecast || []).slice(0, 7).map((day, i) => (
                    <div key={i} style={{background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.3s ease'}}>
                        <span style={{color: '#64748b', fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem'}}>
                            {i === 0 ? 'TODAY' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase()}
                        </span>
                        {getWeatherIcon(day.weather?.main, 32)}
                        <span style={{fontSize: '1.6rem', fontWeight: 900, marginTop: '1.2rem'}}>{Math.round(day.temp_max)}°</span>
                    </div>
                ))}
            </div>

            {/* 4. CLINICAL SATELLITE AREA */}
            <div style={{marginBottom: '2.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem'}}>
                    <h3 style={{fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', letterSpacing: '-0.5px'}}>
                        <Compass className="agri-green" size={24} /> Precision Field Topology
                    </h3>
                    <div style={{display: 'flex', gap: '0.8rem'}}>
                        <div style={{padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.08)'}}>SATELLITE TELEMETRY</div>
                        <div style={{padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5}}>INFRARED</div>
                    </div>
                </div>
                <div style={{height: '500px', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative'}}>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{border: 0, filter: 'grayscale(0.7) contrast(1.1) brightness(0.8)'}}
                        src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=${selectedLocation?.lat || 22.3039},${selectedLocation?.lon || 70.8022}&zoom=14&maptype=satellite`}
                    ></iframe>
                    <div style={{position: 'absolute', bottom: '2rem', right: '2rem', background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '24px', width: '250px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'}}>
                        <p style={{fontSize: '0.65rem', fontWeight: 900, opacity: 0.5, margin: '0 0 0.4rem'}}>FIELD CONNECTED</p>
                        <h4 style={{fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.8rem'}}>8 Active Nodes</h4>
                        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.2rem'}}>
                            {[1,2,3,4,5].map(i => <div key={i} style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--agri-green)'}}></div>)}
                        </div>
                        <button style={{width: '100%', background: '#020617', color: '#fff', border: 'none', padding: '1rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'}}>SCAN SECTOR</button>
                    </div>
                </div>
            </div>

            {/* 5. ENVIRONMENTAL DIAGNOSTICS */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
                    <div style={{background: 'rgba(15, 23, 42, 0.4)', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                            <p style={{fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.15em', margin: 0}}>ENVIRONMENTAL METRICS</p>
                            <Radio size={14} className="agri-green" />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            {[
                                { lab: 'SOIL MOISTURE', val: `${Math.round((indices?.soilMoisture || 0.22) * 100)}%`, icon: <Sprout size={20} color="var(--agri-green)" /> },
                                { lab: 'SOIL TEMP', val: `${Math.round(indices?.soilTemp || 0)}°C`, icon: <Thermometer size={20} color="#60a5fa" /> },
                                { lab: 'AIR QUALITY', val: indices?.airQuality || 'HEALTHY', icon: <Activity size={20} color="#fbbf24" /> }
                            ].map((item, i) => (
                                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                        {item.icon}
                                        <span style={{fontSize: '0.9rem', fontWeight: 700}}>{item.lab}</span>
                                    </div>
                                    <span style={{fontSize: '1.2rem', fontWeight: 900}}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{background: 'rgba(16, 185, 129, 0.05)', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden'}}>
                        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--agri-green)'}}></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                            <span style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--agri-green-light)', letterSpacing: '0.1em'}}>APPLICATION WINDOW</span>
                            <ShieldCheck size={20} className="agri-green" />
                        </div>
                        <p style={{fontSize: '1.6rem', fontWeight: 900, margin: 0, color: '#fff'}}>OPTIMAL CONDITIONS</p>
                    </div>
                </div>

                <div style={{background: 'rgba(15, 23, 42, 0.4)', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px'}}>24-Hour Atmospheric Trend</h3>
                        <div style={{padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.08)'}}>TEMPERATURE PULSE</div>
                    </div>
                    <div style={{flex: 1, minHeight: '200px'}}>
                        <ResponsiveContainer>
                            <AreaChart data={sprayTimeline}>
                                <defs>
                                    <linearGradient id="serenityGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                                <YAxis hide />
                                <Tooltip contentStyle={{background: '#0f172a', border: '1px solid var(--agri-green)', borderRadius: '12px'}} />
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
