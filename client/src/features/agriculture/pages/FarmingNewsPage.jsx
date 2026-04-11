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
    MapPin,
    Calendar
} from 'lucide-react';
import '@/styles/agriIntelligence.css';

const FarmingNewsPage = () => {
    const { news, fetchNews, loading, error, sync: syncNews } = useNewsStore();
    const { currentWeather, fetchAtmosphericDetails } = useWeatherStore();
    const [filter, setFilter] = useState('all');
    const [speaking, setSpeaking] = useState(null);

    useEffect(() => {
        fetchNews();
        // Fetch weather for a default location if not available (e.g., Ahmedabad/Gujarat)
        if (!currentWeather) {
            fetchAtmosphericDetails(23.0225, 72.5714); 
        }
    }, [fetchNews, fetchAtmosphericDetails, currentWeather]);

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                <div>
                    <h1 className="agri-title" style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.2px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                            <Newspaper className="agri-green" size={32} />
                        </div>
                        Agri-Intelligence Journal
                    </h1>
                    <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <MapPin size={16} className="agri-green" /> 
                        Spatial telemetry and policy briefings indexed for Gujarat.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="agri-card" style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#f1f5f9', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: 0.6 }}>
                            <Filter size={16} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>FILTER JOURNALS</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['all', 'news', 'announcement'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    style={{
                                        background: filter === t ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        color: filter === t ? '#10b981' : '#64748b',
                                        border: 'none',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => syncNews()}
                        className="agri-card hover-bg" 
                        style={{
                            padding: '1.1rem 1.8rem', 
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                            border: 'none', 
                            color: '#fff', 
                            fontWeight: 900, 
                            cursor: 'pointer',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        UPDATE REPOSITORY
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem', alignItems: 'start' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Featured Headline */}
                    {latestNews.length > 0 && filter === 'all' && (
                        <div className="agri-card" style={{ padding: 0, overflow: 'hidden', height: '480px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                                <img 
                                    src={latestNews[0].image_url || latestNews[0].image || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80"} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                                    alt="featured"
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%', background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 100%)' }}></div>
                            </div>
                            <div style={{ position: 'relative', zIndex: 2, padding: '3.5rem', marginTop: 'auto' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#059669', padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, display: 'inline-block', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', letterSpacing: '1px' }}>FEATURED INTELLIGENCE</div>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0 0 1.5rem 0', lineHeight: 1.1, letterSpacing: '-1px', color: '#1e293b' }}>{latestNews[0].title}</h2>
                                <p style={{ fontSize: '1.1rem', color: '#475569', opacity: 0.8, marginBottom: '2rem', maxWidth: '800px', lineHeight: 1.6, fontWeight: 500 }}>{latestNews[0].content?.substring(0, 200) || latestNews[0].description?.substring(0, 200)}...</p>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <button 
                                        onClick={() => window.open(latestNews[0].url || latestNews[0].link, '_blank')}
                                        style={{ background: '#1e293b', color: '#ffffff', padding: '1rem 2rem', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        READ FULL BRIEFING
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.5, fontSize: '0.9rem', fontWeight: 700 }}>
                                        <Calendar size={18} />
                                        {latestNews[0].published_at ? new Date(latestNews[0].published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* News Feed Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                        {loading && (!news || news.length === 0) ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '10rem 0' }}>
                                <RefreshCw className="spin" size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', color: 'var(--agri-green)' }} />
                                <p style={{ fontWeight: 800, letterSpacing: '2px', opacity: 0.4 }}>INDEXING LATEST DATA STREAM...</p>
                            </div>
                        ) : filteredNews.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="agri-card hover-bg" 
                                style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                            >
                                <div style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                                    <img src={item.image_url || item.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="news" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--agri-green)', letterSpacing: '1px' }}>{item.source?.toUpperCase() || item.category?.toUpperCase() || 'EXTERNAL AGRI-GOV'}</span>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 700 }}>{item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recently'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 1rem 0', lineHeight: 1.3, height: '3.4rem', overflow: 'hidden' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.95rem', color: '#64748b', opacity: 0.8, lineHeight: 1.6, height: '4.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>{item.content?.substring(0, 150) || item.description?.substring(0, 150)}...</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button 
                                            onClick={() => window.open(item.url || item.link, '_blank')}
                                            style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', color: '#1e293b', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            CONTINUE READING
                                        </button>
                                        <button 
                                            onClick={() => handleSpeak(`${item.title}. ${item.content || item.description}`, idx)}
                                            style={{ color: speaking === idx ? 'var(--agri-green)' : 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Volume2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDEBAR: ADVISORIES & CLIMATE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '100px' }}>
                    
                    {/* Climate Telemetry */}
                    <div className="agri-card" style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '32px' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981'}}></div>
                            Climate Telemetry
                        </h4>
                        {currentWeather ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ background: '#ffffff', padding: '1.8rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-2px' }}>{Math.round(currentWeather.main?.temp)}°C</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>{(currentWeather.weather?.[0]?.description || 'Clear').toUpperCase()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--agri-green)', marginBottom: '4px' }}>{currentWeather.main?.humidity}% RH</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800 }}>HUMIDITY INDEX</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '14px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{currentWeather.wind?.speed} m/s</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>WIND VELOCITY</div>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '14px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{currentWeather.main?.pressure} hPa</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>SURFACE PRESSURE</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '3rem 0', textAlign: 'center', opacity: 0.3 }}>
                                <RefreshCw className="spin" size={32} style={{ marginBottom: '1rem' }} />
                                <p style={{fontWeight: 800, fontSize: '0.75rem'}}>HANDSHAKING SATELLITE...</p>
                            </div>
                        )}
                    </div>

                    {/* Announcements Spotlight */}
                    <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                             <Megaphone className="agri-accent" size={24} /> Policy Briefings
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {announcements.length > 0 ? announcements.map((ann, idx) => (
                                <div key={idx} style={{ paddingLeft: '1.5rem', borderLeft: '3px solid var(--agri-accent)', cursor: 'pointer' }} onClick={() => window.open(ann.link || ann.url, '_blank')}>
                                    <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{ann.title}</h5>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.4, fontWeight: 700 }}>
                                        <span>GOVT SCHEME</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            )) : (
                                <p style={{opacity: 0.3, fontSize: '0.9rem', textAlign: 'center'}}>No active briefings found.</p>
                            )}
                        </div>
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

const FarmingNewsPageWrapper = () => (
    <>
        <style>{animations}</style>
        <FarmingNewsPage />
    </>
);

export default FarmingNewsPageWrapper;

