import React, { useEffect, useState } from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { 
    Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, 
    Navigation, MapPin, Calendar, Clock, AlertTriangle, 
    ChevronRight, Search, Zap
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import '../../styles/agriIntelligence.css';

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
                pointerEvents: 'none', zIndex: 0, opacity: 0.4,
                background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
            }} />

            {/* HEADER & SEARCH */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1}}>
                <div>
                    <h1 className="agri-title">Weather Command Center</h1>
                    <p style={{opacity: 0.6, fontSize: '1.1rem', letterSpacing: '0.02em'}}>Precision atmosphere telemetry & growth indicators.</p>
                </div>

                <div style={{position: 'relative', width: '400px'}}>
                    <div className="agri-card" style={{padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)'}}>
                        <Search size={22} className="agri-green" style={{opacity: 0.7}} />
                        <input 
                            type="text" 
                            placeholder="Enter Village / City / State..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1.1rem'}}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="agri-card" style={{position: 'absolute', top: '120%', left: 0, right: 0, zIndex: 100, padding: '0.5rem', background: 'rgba(15, 23, 42, 0.98)', border: '1px solid var(--agri-green)'}}>
                            {searchResults.map((res, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => selectResult(res)}
                                    style={{padding: '1rem', cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s'}}
                                    className="hover-bg"
                                >
                                    <div style={{fontWeight: 700}}>{res.name}</div>
                                    <div style={{fontSize: '0.8rem', opacity: 0.5}}>Regional Coordinates: {res.lat.toFixed(2)}, {res.lon.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading && !currentWeather ? (
                <div style={{textAlign: 'center', padding: '12rem 0', position: 'relative', zIndex: 1}}>
                    <div className="spinner" style={{width: '60px', height: '60px', margin: '0 auto 3rem', borderWidth: '4px'}}></div>
                    <h2 style={{fontSize: '2rem', fontWeight: 800}}>Synchronizing Climate Data...</h2>
                    <p style={{opacity: 0.5, marginTop: '1rem'}}>Aggregating satellite telemetry and local station metrics.</p>
                </div>
            ) : (
                <div style={{position: 'relative', zIndex: 1}}>
                {/* HERO SECTION */}
                <div className="stats-grid">
                    <div className="agri-card" style={{
                        gridColumn: 'span 2', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 78, 59, 0.3))',
                        padding: '3rem'
                    }}>
                        <div style={{display: 'flex', gap: '4rem', alignItems: 'center'}}>
                            <div style={{
                                width: '160px', height: '160px', borderRadius: '50%', 
                                background: 'rgba(255,255,255,0.03)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)'
                            }}>
                                {currentWeather?.weather[0]?.main === 'Rain' ? <CloudRain size={90} className="icon-gradient-sky" /> : <Sun size={90} style={{color: '#fbbf24', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))'}} />}
                            </div>
                            <div>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
                                    <h1 style={{fontSize: '7rem', fontWeight: 900, marginBottom: '0', color: '#fff', letterSpacing: '-0.05em'}}>
                                        {Math.round(currentWeather?.main?.temp || 0)}°
                                    </h1>
                                    <div style={{opacity: 0.6, fontSize: '1.5rem', fontWeight: 700}}>
                                        <div style={{color: '#f87171'}}>↑ {Math.round(currentWeather?.main?.temp_max || 0)}°</div>
                                        <div style={{color: '#60a5fa'}}>↓ {Math.round(currentWeather?.main?.temp_min || 0)}°</div>
                                    </div>
                                </div>
                                <p style={{fontSize: '1.8rem', opacity: 0.9, fontWeight: 800, textTransform: 'capitalize', marginTop: '0.5rem'}}>
                                    {currentWeather?.weather[0]?.description}
                                </p>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.5rem'}}>
                                    <div className="weather-badge">
                                        <MapPin size={16} /> {currentWeather?.name || 'Local Station'}
                                    </div>
                                    <div className="weather-badge" style={{background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)'}}>
                                        {new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '3rem'}}>
                            <div style={{textAlign: 'center', minWidth: '100px'}}>
                                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'}}>
                                    <Droplets size={28} color="#34d399" />
                                </div>
                                <p style={{fontSize: '1.8rem', fontWeight: 800}}>{currentWeather?.main?.humidity}%</p>
                                <p style={{fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Humidity</p>
                            </div>
                            <div style={{textAlign: 'center', minWidth: '100px'}}>
                                 <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'}}>
                                    <Wind size={28} color="#34d399" />
                                </div>
                                <p style={{fontSize: '1.8rem', fontWeight: 800}}>{currentWeather?.wind?.speed}</p>
                                <p style={{fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em'}}>KM/H WIND</p>
                            </div>
                        </div>
                    </div>

                    <div className="agri-card" style={{border: '1px solid rgba(245, 158, 11, 0.2)'}}>
                        <h3 style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem'}}>
                            <Zap size={22} style={{color: 'var(--agri-accent)'}} /> Growth Insights
                        </h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
                            {insights.map((insight, i) => (
                                <div key={i} style={{
                                    padding: '1.2rem', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    borderRadius: '1.2rem', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderLeft: `4px solid ${insight.type === 'WARNING' ? '#f87171' : '#10b981'}`
                                }}>
                                    <h4 style={{fontSize: '1rem', marginBottom: '0.4rem', color: insight.type === 'WARNING' ? '#f87171' : '#34d399'}}>{insight.title}</h4>
                                    <p style={{fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5}}>{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* VISUALS SECTION */}
                <div className="stats-grid" style={{marginTop: '3rem'}}>
                    {/* HOURLY CHART */}
                    <div className="agri-card" style={{gridColumn: 'span 2'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                            <h3 style={{fontSize: '1.4rem'}}>24-Hour Predictive Trends</h3>
                            <div style={{display: 'flex', gap: '1.5rem', fontSize: '0.8rem'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: '12px', height: '12px', background: '#fbbf24', borderRadius: '3px'}}></div> TEMPERATURE</div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: '12px', height: '12px', background: '#60a5fa', borderRadius: '3px'}}></div> RAIN PROBABILITY</div>
                            </div>
                        </div>
                        <div style={{height: '350px', width: '100%'}}>
                            <ResponsiveContainer>
                                <AreaChart data={hourlyData}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.3)" tick={{fontSize: 11}} />
                                    <YAxis axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.3)" tick={{fontSize: 11}} />
                                    <Tooltip 
                                        contentStyle={{background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.2rem', padding: '1rem'}}
                                        itemStyle={{fontWeight: 700}}
                                    />
                                    <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#fbbf24" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={4} />
                                    <Area type="monotone" dataKey="rain" name="Precipitation (%)" stroke="#60a5fa" fillOpacity={1} fill="url(#colorRain)" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 7-DAY FORECAST */}
                    <div className="agri-card">
                        <h3 style={{marginBottom: '2.5rem', fontSize: '1.4rem'}}>Synoptic 8-Day Forecast</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            {forecast?.daily?.map((day, i) => (
                                <div key={i} style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '1rem',
                                    transition: 'all 0.2s'
                                }} className="hover-bg">
                                    <p style={{width: '70px', fontWeight: 500, opacity: 0.8}}>{i === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</p>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1.2rem'}}>
                                        <div style={{width: '30px', display: 'flex', justifyContent: 'center'}}>
                                            {day.weather[0].main === 'Rain' ? <CloudRain size={20} color="#60a5fa" /> : <Sun size={20} color="#fbbf24" />}
                                        </div>
                                        <div style={{display: 'flex', gap: '0.8rem', width: '90px'}}>
                                            <p style={{fontWeight: 800, color: '#fff'}}>{Math.round(day.temp.max)}°</p>
                                            <p style={{fontWeight: 500, opacity: 0.4}}>{Math.round(day.temp.min)}°</p>
                                        </div>
                                    </div>
                                    <div style={{background: 'rgba(255,255,255,0.03)', height: '6px', width: '70px', borderRadius: '10px', overflow: 'hidden'}}>
                                        <div style={{background: '#60a5fa', height: '100%', width: `${Math.round((day.pop || 0) * 100)}%`, borderRadius: '10px', boxShadow: '0 0 10px rgba(96, 165, 250, 0.4)'}}></div>
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
