import React, { useEffect, useState } from 'react';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { 
    Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, 
    Navigation, MapPin, Calendar, Clock, AlertTriangle, 
    ChevronRight, Search, Zap
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import '@/styles/agriIntelligence.css';

const WeatherDashboard = () => {
    const { 
        currentWeather, forecast, insights, loading, error,
        fetchCurrentWeather, fetchSavedLocations, savedLocations,
        selectedLocation, setSelectedLocation, searchLocations
    } = useWeatherStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchSavedLocations();
        // Initial fetch based on IP/GPS
        if (!selectedLocation) {
            fetchCurrentWeather();
        }
    }, []);

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            const results = await searchLocations(e.target.value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const selectResult = (res) => {
        setSelectedLocation(res);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Prepare chart data
    const hourlyData = forecast?.hourly?.slice(0, 24).map(h => ({
        time: new Date(h.dt * 1000).getHours() + ":00",
        temp: Math.round(h.temp),
        rain: Math.round((h.pop || 0) * 100)
    })) || [];

    return (
        <div className="agri-page">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                pointerEvents: 'none', zIndex: 0, opacity: 0.3,
                background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)'
            }} />

            {/* HEADER & SEARCH */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1}}>
                <div>
                    <h1 className="agri-title">Weather Intelligence</h1>
                    <p style={{opacity: 0.5, fontSize: '0.95rem'}}>Atmosphere telemetry & precision indicators.</p>
                </div>

                <div style={{position: 'relative', width: '320px'}}>
                    <div className="agri-card" style={{padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.02)'}}>
                        <Search size={18} className="agri-green" style={{opacity: 0.7}} />
                        <input 
                            type="text" 
                            placeholder="Search Village / City..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.95rem'}}
                        />
                    </div>
                </div>
            </div>

            {loading && !currentWeather ? (
                <div style={{textAlign: 'center', padding: '8rem 0'}}>
                    <div className="spinner" style={{width: '40px', height: '40px', margin: '0 auto 2rem', borderWidth: '3px'}}></div>
                    <p style={{opacity: 0.5}}>Synchronizing Climate Data...</p>
                </div>
            ) : (
                <div style={{position: 'relative', zIndex: 1}}>
                {/* HERO SECTION */}
                <div className="stats-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                    <div className="agri-card" style={{
                        gridColumn: 'span 2', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.2))',
                        padding: '2rem'
                    }}>
                        <div style={{display: 'flex', gap: '2.5rem', alignItems: 'center'}}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%', 
                                background: 'rgba(255,255,255,0.03)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {currentWeather?.weather[0]?.main === 'Rain' ? <CloudRain size={50} className="icon-gradient-sky" /> : <Sun size={50} style={{color: '#fbbf24'}} />}
                            </div>
                            <div>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.8rem'}}>
                                    <span style={{fontSize: '4.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em'}}>
                                        {Math.round(currentWeather?.main?.temp || 0)}°
                                    </span>
                                    <div style={{opacity: 0.6, fontSize: '1.1rem', fontWeight: 600}}>
                                        <div style={{color: '#f87171'}}>↑ {Math.round(currentWeather?.main?.temp_max || 0)}°</div>
                                        <div style={{color: '#60a5fa'}}>↓ {Math.round(currentWeather?.main?.temp_min || 0)}°</div>
                                    </div>
                                </div>
                                <p style={{fontSize: '1.2rem', opacity: 0.8, fontWeight: 700, textTransform: 'capitalize'}}>
                                    {currentWeather?.weather[0]?.description}
                                </p>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem'}}>
                                    <MapPin size={14} className="agri-green" /> 
                                    <span style={{fontSize: '0.9rem', opacity: 0.7}}>{currentWeather?.name || 'Local Station'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '2rem'}}>
                            <div style={{textAlign: 'center'}}>
                                <Droplets size={22} className="agri-green" style={{marginBottom: '0.5rem'}} />
                                <p style={{fontSize: '1.4rem', fontWeight: 700}}>{currentWeather?.main?.humidity}%</p>
                                <p style={{fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase'}}>Humidity</p>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Wind size={22} className="agri-green" style={{marginBottom: '0.5rem'}} />
                                <p style={{fontSize: '1.4rem', fontWeight: 700}}>{currentWeather?.wind?.speed}</p>
                                <p style={{fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase'}}>Wind km/h</p>
                            </div>
                        </div>
                    </div>

                    <div className="agri-card">
                        <h3 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem'}}>
                            <Zap size={18} style={{color: 'var(--agri-accent)'}} /> Insights
                        </h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                            {insights.slice(0, 2).map((insight, i) => (
                                <div key={i} style={{
                                    padding: '1rem', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    borderRadius: '0.8rem', 
                                    borderLeft: `3px solid ${insight.type === 'WARNING' ? '#f87171' : '#10b981'}`
                                }}>
                                    <h4 style={{fontSize: '0.85rem', marginBottom: '0.2rem', color: insight.type === 'WARNING' ? '#f87171' : '#34d399'}}>{insight.title}</h4>
                                    <p style={{fontSize: '0.8rem', opacity: 0.6, lineHeight: 1.4}}>{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* VISUALS SECTION */}
                <div className="stats-grid" style={{marginTop: '2rem', gridTemplateColumns: '1.8fr 1.2fr'}}>
                    {/* HOURLY CHART */}
                    <div className="agri-card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                            <h3 style={{fontSize: '1.1rem'}}>24-Hour Forecast</h3>
                            <div style={{display: 'flex', gap: '1rem', fontSize: '0.7rem', opacity: 0.6}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width: '8px', height: '8px', background: '#fbbf24', borderRadius: '2px'}}></div> TEMP</div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width: '8px', height: '8px', background: '#60a5fa', borderRadius: '2px'}}></div> RAIN</div>
                            </div>
                        </div>
                        <div style={{height: '220px', width: '100%'}}>
                            <ResponsiveContainer>
                                <AreaChart data={hourlyData}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.2)" tick={{fontSize: 10}} />
                                    <YAxis axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.2)" tick={{fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.8rem', fontSize: '0.8rem'}}
                                    />
                                    <Area type="monotone" dataKey="temp" stroke="#fbbf24" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="rain" stroke="#60a5fa" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 7-DAY FORECAST */}
                    <div className="agri-card">
                        <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>8-Day Outlook</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                            {forecast?.daily?.map((day, i) => (
                                <div key={i} style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '0.5rem 0.8rem',
                                    borderRadius: '0.6rem',
                                }} className="hover-bg">
                                    <span style={{width: '60px', fontSize: '0.85rem', opacity: 0.6}}>{i === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</span>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                        <div style={{width: '24px', display: 'flex', justifyContent: 'center'}}>
                                            {day.weather[0].main === 'Rain' ? <CloudRain size={16} color="#60a5fa" /> : <Sun size={16} color="#fbbf24" />}
                                        </div>
                                        <div style={{display: 'flex', gap: '0.6rem', width: '70px', fontSize: '0.9rem'}}>
                                            <span style={{fontWeight: 700}}>{Math.round(day.temp.max)}°</span>
                                            <span style={{opacity: 0.3}}>{Math.round(day.temp.min)}°</span>
                                        </div>
                                    </div>
                                    <div style={{background: 'rgba(255,255,255,0.03)', height: '4px', width: '50px', borderRadius: '4px', overflow: 'hidden'}}>
                                        <div style={{background: '#60a5fa', height: '100%', width: `${Math.round((day.pop || 0) * 100)}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDashboard;
