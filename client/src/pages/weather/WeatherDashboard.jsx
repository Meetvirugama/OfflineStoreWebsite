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
            {/* HEADER & SEARCH */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                <div>
                    <h1 className="agri-title">Weather Intelligence</h1>
                    <p style={{opacity: 0.7}}>Precision climate monitoring for smarter farming.</p>
                </div>

                <div style={{position: 'relative', width: '350px'}}>
                    <div className="agri-card" style={{padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <Search size={18} opacity={0.5} />
                        <input 
                            type="text" 
                            placeholder="Search Village / City..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none'}}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="agri-card" style={{position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 100, padding: '0.5rem', background: 'rgba(15, 23, 42, 0.95)'}}>
                            {searchResults.map((res, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => selectResult(res)}
                                    style={{padding: '0.8rem', cursor: 'pointer', borderRadius: '0.5rem'}}
                                    className="hover-bg"
                                >
                                    {res.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading && !currentWeather ? (
                <div style={{textAlign: 'center', padding: '10rem'}}>
                    <div className="spinner" style={{margin: '0 auto 2rem'}}></div>
                    <h3>Syncing with Satellites...</h3>
                </div>
            ) : (
                <>
                {/* HERO SECTION */}
                <div className="stats-grid">
                    <div className="agri-card" style={{gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.4))'}}>
                        <div style={{display: 'flex', gap: '3rem', alignItems: 'center'}}>
                            <div className="weather-icon-large">
                                {currentWeather?.weather[0]?.main === 'Rain' ? <CloudRain size={80} color="#60a5fa" /> : <Sun size={80} color="#fbbf24" />}
                            </div>
                            <div>
                                <h1 style={{fontSize: '5rem', marginBottom: '0', color: '#fff'}}>{Math.round(currentWeather?.main?.temp || 0)}°C</h1>
                                <p style={{fontSize: '1.5rem', opacity: 0.8, fontWeight: 700}}>{currentWeather?.weather[0]?.description}</p>
                                <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.6}}>
                                    <MapPin size={16} /> {currentWeather?.name}, {selectedLocation?.state || 'India'}
                                </p>
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                            <div style={{textAlign: 'center'}}>
                                <Droplets size={24} color="#34d399" style={{marginBottom: '0.5rem'}} />
                                <p style={{fontSize: '1.2rem', fontWeight: 700}}>{currentWeather?.main?.humidity}%</p>
                                <p style={{fontSize: '0.8rem', opacity: 0.5}}>Humidity</p>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Wind size={24} color="#34d399" style={{marginBottom: '0.5rem'}} />
                                <p style={{fontSize: '1.2rem', fontWeight: 700}}>{currentWeather?.wind?.speed} km/h</p>
                                <p style={{fontSize: '0.8rem', opacity: 0.5}}>Wind</p>
                            </div>
                        </div>
                    </div>

                    <div className="agri-card">
                        <h3 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                            <Zap size={20} className="agri-accent" /> Farming Intelligence
                        </h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            {insights.map((insight, i) => (
                                <div key={i} style={{padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', borderLeft: `4px solid ${insight.type === 'WARNING' ? '#f87171' : '#10b981'}`}}>
                                    <h4 style={{fontSize: '0.9rem', marginBottom: '0.3rem'}}>{insight.title}</h4>
                                    <p style={{fontSize: '0.8rem', opacity: 0.7}}>{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* VISUALS SECTION */}
                <div className="stats-grid" style={{marginTop: '2rem'}}>
                    {/* HOURLY CHART */}
                    <div className="agri-card" style={{gridColumn: 'span 2'}}>
                        <h3 style={{marginBottom: '2rem'}}>Hourly Temperature & Rain (%)</h3>
                        <div style={{height: '300px', width: '100%'}}>
                            <ResponsiveContainer>
                                <AreaChart data={hourlyData}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.5)" />
                                    <YAxis axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip contentStyle={{background: '#1e293b', border: 'none', borderRadius: '1rem'}} />
                                    <Area type="monotone" dataKey="temp" stroke="#fbbf24" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="rain" stroke="#60a5fa" fill="rgba(96, 165, 250, 0.2)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 7-DAY FORECAST */}
                    <div className="agri-card">
                        <h3 style={{marginBottom: '2rem'}}>8-Day Outlook</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
                            {forecast?.daily?.map((day, i) => (
                                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <p style={{width: '60px', opacity: 0.7}}>{i === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</p>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                        {day.weather[0].main === 'Rain' ? <CloudRain size={20} color="#60a5fa" /> : <Sun size={20} color="#fbbf24" />}
                                        <p style={{width: '40px', fontWeight: 700}}>{Math.round(day.temp.max)}°</p>
                                        <p style={{width: '40px', opacity: 0.4}}>{Math.round(day.temp.min)}°</p>
                                    </div>
                                    <div style={{background: 'rgba(255,255,255,0.05)', height: '4px', width: '60px', borderRadius: '10px'}}>
                                        <div style={{background: '#60a5fa', height: '100%', width: `${(day.pop || 0) * 100}%`, borderRadius: '10px'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default WeatherDashboard;
