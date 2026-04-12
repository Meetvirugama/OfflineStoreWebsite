import React, { useEffect, useState } from 'react';
import useNewsStore from '@features/agriculture/news/news.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { 
    Newspaper, 
    Megaphone, 
    TrendingUp, 
    Volume2, 
    Filter, 
    RefreshCw,
    MapPin,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import '@/styles/agriIntelligence.css';

const FarmingNewsPage = () => {
    const { news, fetchNews, loading, sync: syncNews } = useNewsStore();
    const { currentWeather, fetchAtmosphericDetails } = useWeatherStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNews();
        if (!currentWeather) {
            fetchAtmosphericDetails(23.0225, 72.5714); 
        }
    }, [fetchNews, fetchAtmosphericDetails, currentWeather]);

    const filteredNews = Array.isArray(news) ? news.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    }) : [];

    const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
    const feedNews = filteredNews.slice(1);

    return (
        <div className="agri-page">
            {/* Header Area */}
            <div className="agri-page__header" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem'}}>
                    <div>
                        <h1 className="agri-title" style={{fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                             <div className="pulse-green" style={{width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                                <Newspaper className="agri-green" size={24} />
                             </div>
                             Intelligence Feed
                        </h1>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem'}}>
                            <p style={{opacity: 0.5, fontSize: '0.9rem', margin: 0, fontWeight: 500}}>Aggregated global agricultural journals & policy briefs.</p>
                            <span style={{
                                fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', 
                                border: '1px solid #10b981', borderRadius: '1rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.5px'
                            }}>
                                API SYNC: ACTIVE
                            </span>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '0.8rem', alignItems: 'center'}}>
                        <button 
                            onClick={() => syncNews()}
                            className="agri-card hover-bg" 
                            disabled={loading}
                            style={{
                                padding: '0.9rem 1.8rem', 
                                background: 'var(--agri-green)', 
                                border: 'none', 
                                color: '#fff', 
                                fontWeight: 800, 
                                cursor: 'pointer',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                fontSize: '0.9rem',
                                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)'
                            }}
                        >
                            <RefreshCw size={18} className={loading ? 'spin' : ''} />
                            {loading ? 'SYNCING...' : 'SYNC REPOSITORY'}
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="agri-card glass-card" style={{padding: '0.6rem 1rem', display: 'flex', gap: '1.5rem', alignItems: 'center', width: 'fit-content', borderRadius: '20px', marginTop: '1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.6, borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '1.5rem'}}>
                        <Filter size={14} className="agri-green" />
                        <span style={{fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.5px', color: '#1e293b'}}>FILTERS</span>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        {['all', 'news', 'market', 'tech'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setFilter(type)}
                                style={{
                                    background: filter === type ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                    color: filter === type ? '#059669' : '#64748b',
                                    border: 'none',
                                    padding: '0.5rem 1.4rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: filter === type ? 900 : 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '0.3px'
                                }}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="stats-grid" style={{gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2.5rem', alignItems: 'start'}}>
                {/* Main Feed Column */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                    {/* Featured Hero Card */}
                    {featuredNews && (
                        <div className="agri-card premium-panel" style={{padding: 0, overflow: 'hidden', minHeight: '450px', display: 'flex', flexDirection: 'column', borderRadius: '32px'}}>
                            <div style={{height: '280px', position: 'relative'}}>
                                <img 
                                    src={featuredNews.image || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80"} 
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                                    alt="featured"
                                />
                                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, transparent 100%)'}}></div>
                                <div style={{position: 'absolute', top: '2rem', left: '2rem'}}>
                                    <span style={{background: 'var(--agri-accent)', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'}}>TOP JOURNAL</span>
                                </div>
                            </div>
                            <div style={{padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff'}}>
                                <h2 style={{fontSize: '2.2rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1.2px', color: '#1e293b'}}>
                                    {featuredNews.title}
                                </h2>
                                <p style={{fontSize: '1.1rem', color: '#475569', opacity: 0.85, marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500, maxWidth: '90%'}}>
                                    {featuredNews.description?.substring(0, 200)}...
                                </p>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                                    <button 
                                        onClick={() => window.open(featuredNews.link, '_blank')}
                                        className="agri-card hover-bg"
                                        style={{background: '#1e293b', color: '#fff', padding: '1rem 2.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem'}}
                                    >
                                        Access Report <ArrowUpRight size={20} />
                                    </button>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.5, fontSize: '0.85rem', fontWeight: 800}}>
                                        <Calendar size={18} />
                                        {new Date(featuredNews.published_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Feed Grid */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem'}}>
                        {loading && feedNews.length === 0 ? (
                            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '10rem 0'}}>
                                <RefreshCw className="spin agri-green" size={40} style={{opacity: 0.2}} />
                                <p style={{marginTop: '1rem', fontWeight: 800, opacity: 0.3, letterSpacing: '1px'}}>INDEXING LIVE DATA...</p>
                            </div>
                        ) : feedNews.length === 0 && !loading ? (
                            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 0', background: 'rgba(0,0,0,0.02)', borderRadius: '32px', border: '2px dashed rgba(0,0,0,0.05)'}}>
                                <div style={{width: '60px', height: '60px', background: 'rgba(0,0,0,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                                    <Filter size={24} style={{opacity: 0.2}} />
                                </div>
                                <h3 style={{fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.5rem'}}>No {filter.toUpperCase()} Intelligence</h3>
                                <p style={{color: '#64748b', fontSize: '0.9rem', fontWeight: 500}}>We couldn't find any localized updates for this segment today.</p>
                                <button 
                                    onClick={() => setFilter('all')}
                                    style={{marginTop: '1.5rem', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', padding: '0.5rem 1.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', color: '#64748b'}}
                                >
                                    View All News
                                </button>
                            </div>
                        ) : feedNews.map((item, idx) => (
                            <div key={idx} className="agri-card glass-card hover-bg" style={{padding: '1.8rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.06)'}}>
                                <div style={{height: '200px', borderRadius: '20px', overflow: 'hidden', position: 'relative'}}>
                                    <img src={item.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="news" />
                                    <div style={{position: 'absolute', top: '1rem', right: '1rem'}}>
                                        <span style={{background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#1e293b', padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, border: '1px solid rgba(0,0,0,0.05)'}}>
                                            {item.type?.toUpperCase() || 'NEWS'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '1rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                        {item.title}
                                    </h3>
                                    <p style={{fontSize: '0.95rem', color: '#64748b', opacity: 0.8, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem', fontWeight: 500}}>
                                        {item.description}
                                    </p>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                                        <button 
                                            onClick={() => window.open(item.link, '_blank')}
                                            style={{background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.15)', color: 'var(--agri-green)', padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'}}
                                        >
                                            View Analysis
                                        </button>
                                        <div style={{fontSize: '0.75rem', opacity: 0.4, fontWeight: 800}}>
                                            {new Date(item.published_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '100px'}}>
                    {/* Live Telemetry Card */}
                    <div className="agri-card premium-panel" style={{padding: '2.5rem', borderRadius: '32px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)'}}>
                        <h4 style={{fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b'}}>
                            <div className="pulse-green" style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981'}}></div>
                            Climate Vectors
                        </h4>
                        {currentWeather ? (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)'}}>
                                    <div>
                                        <div style={{fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-2px', color: '#1e293b'}}>{Math.round(currentWeather.main?.temp)}°C</div>
                                        <div style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--agri-green)', letterSpacing: '0.5px'}}>LOCAL SYNC ACTIVE</div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <div style={{fontSize: '1.2rem', fontWeight: 900, color: '#1e293b'}}>{currentWeather.main?.humidity}%</div>
                                        <div style={{fontSize: '0.7rem', opacity: 0.5, fontWeight: 900}}>HUMIDITY</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{padding: '2rem 0', textAlign: 'center', opacity: 0.3}}>
                                <RefreshCw className="spin" size={32} style={{marginBottom: '0.8rem'}} />
                                <p style={{fontSize: '0.75rem', fontWeight: 800}}>SYNCING SENSORS...</p>
                            </div>
                        )}
                    </div>

                    {/* Government Policy Hub */}
                    <div className="agri-card glass-card" style={{padding: '2.5rem', borderRadius: '32px'}}>
                        <h4 style={{fontSize: '1.2rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b'}}>
                            <Megaphone className="agri-accent pulse-green" size={24} /> Policy Journal
                        </h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                            {news.filter(n => n.type === 'market' || n.type === 'alert' || n.type === 'news').slice(0, 5).map((ann, idx) => (
                                <div key={idx} style={{paddingLeft: '1.5rem', borderLeft: '4px solid var(--agri-accent)', cursor: 'pointer', transition: 'all 0.2s'}} onClick={() => window.open(ann.link, '_blank')}>
                                    <h5 style={{fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                        {ann.title}
                                    </h5>
                                    <div style={{fontSize: '0.7rem', opacity: 0.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}}>STRATEGIC UPDATE</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmingNewsPage;
