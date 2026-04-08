import React, { useEffect, useState } from 'react';
import useNewsStore from '@features/agriculture/news/news.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { 
    Newspaper, 
    Megaphone, 
    CloudRain, 
    TrendingUp, 
    Volume2, 
    ExternalLink, 
    Filter, 
    RefreshCw,
    AlertTriangle,
    Info,
    ChevronRight,
    MapPin
} from 'lucide-react';
import '@/styles/agriIntelligence.css';

const FarmingNewsPage = () => {
    const { news, fetchNews, loading, error, syncNews } = useNewsStore();
    const { currentWeather, fetchCurrentWeather } = useWeatherStore();
    const [filter, setFilter] = useState('all');
    const [speaking, setSpeaking] = useState(null);

    useEffect(() => {
        fetchNews();
        // Fetch weather for a default location if not available (e.g., Ahmedabad/Gujarat)
        if (!currentWeather) {
            fetchCurrentWeather(23.0225, 72.5714); 
        }
    }, [fetchNews, fetchCurrentWeather, currentWeather]);

    const filteredNews = Array.isArray(news) ? news.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    }) : [];

    const announcements = Array.isArray(news) ? news.filter(item => item.type === 'announcement').slice(0, 3) : [];

    const latestNews = filteredNews.filter(item => item.type === 'news');

    const handleSpeak = (text, id) => {
        if (speaking === id) {
            window.speechSynthesis.cancel();
            setSpeaking(null);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setSpeaking(null);
        window.speechSynthesis.speak(utterance);
        setSpeaking(id);
    };

    return (
        <div className="agri-page">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="agri-title">Agri-Insights & Announcements</h1>
                    <p style={{ opacity: 0.5, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} className="agri-green" /> 
                        Real-time agricultural intelligence for Gujarat, India
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => syncNews()}
                        className="agri-card hover-bg" 
                        style={{
                            padding: '0.6rem 1.2rem', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            color: '#fff', 
                            cursor: 'pointer',
                            borderRadius: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.85rem'
                        }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                        Update Feed
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Filter Bar */}
                    <div className="agri-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <Filter size={16} className="agri-green" />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['all', 'news', 'announcement'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '0.6rem',
                                            background: filter === type ? 'var(--agri-green)' : 'transparent',
                                            border: 'none',
                                            color: filter === type ? '#fff' : 'rgba(255,255,255,0.5)',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Showing {filteredNews.length} articles</span>
                    </div>

                    {/* News Feed */}
                    {loading && news.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem', opacity: 0.5 }}>Scanning agricultural journals...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {filteredNews.map((item) => (
                                <div key={item.id} className="agri-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', minHeight: '180px' }}>
                                    {item.image && (
                                        <div style={{ width: '220px', minWidth: '220px', position: 'relative' }}>
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {item.priority === 'HIGH' && (
                                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--agri-accent)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Megaphone size={10} /> HIGH PRIORITY
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.7rem', color: item.type === 'announcement' ? 'var(--agri-accent)' : 'var(--agri-green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {item.category || item.type}
                                                </span>
                                                <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>
                                                    {item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                                                </span>

                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.4 }}>{item.title}</h3>
                                            <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.description}
                                            </p>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button 
                                                    onClick={() => handleSpeak(`${item.title}. ${item.description}`, item.id)}
                                                    style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: speaking === item.id ? 'var(--agri-green)' : '#fff', padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                                >
                                                    <Volume2 size={16} className={speaking === item.id ? 'pulse' : ''} />
                                                </button>
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--agri-green)', textDecoration: 'none', fontWeight: 600 }}>
                                                    Full Story <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Announcement Spotlight */}
                    <div className="agri-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <Megaphone className="agri-accent" size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Govt Spotlight</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {announcements.map(ann => (
                                <div key={ann.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', cursor: 'pointer' }} onClick={() => window.open(ann.link, '_blank')}>
                                        {ann.title}
                                    </h4>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Scheme / Policy</span>
                                </div>
                            ))}
                            {announcements.length === 0 && <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>No active alerts.</p>}
                        </div>
                    </div>

                    {/* Weather Impact */}
                    <div className="agri-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <CloudRain className="agri-green" size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Weather Impact</h3>
                        </div>
                        {currentWeather ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.8rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Math.round(currentWeather.main?.temp)}°C</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{(currentWeather.weather?.[0]?.description || 'Clear').toUpperCase()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--agri-green)' }}>{currentWeather.main?.humidity}% RH</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Humidity</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Advisory */}
                                <div style={{ borderLeft: '3px solid var(--agri-accent)', padding: '0.5rem 1rem', background: 'rgba(245, 158, 11, 0.05)' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--agri-accent)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <AlertTriangle size={12} /> SOWING ADVISORY
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.4 }}>
                                        {currentWeather.main?.temp > 35 ? 'Extremely high heat. Prioritize evening irrigation.' : 'Optimal conditions for fertilizer application.'}
                                    </p>
                                </div>
                            </div>

                        ) : (
                            <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>Syncing local climate...</p>
                        )}
                    </div>

                    {/* Market Trends */}
                    <div className="agri-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <TrendingUp className="agri-green" size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Mandi Pulse</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { crop: 'Cotton', price: '7,250', trend: 'up' },
                                { crop: 'Wheat', price: '2,240', trend: 'down' },
                                { crop: 'Groundnut', price: '5,800', trend: 'up' }
                            ].map(item => (
                                <div key={item.crop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.crop}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>₹{item.price}</span>
                                        <div style={{ color: item.trend === 'up' ? '#10b981' : '#ef4444' }}>
                                            {item.trend === 'up' ? '▲' : '▼'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => window.location.href='/analytics'}
                            style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem', borderRadius: '0.6rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            Full Analysis <ChevronRight size={14} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};


const animations = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}
.spin { animation: spin 1s linear infinite; }
.pulse { animation: pulse 2s ease-in-out infinite; }
`;

export default () => (
    <>
        <style>{animations}</style>
        <FarmingNewsPage />
    </>
);

