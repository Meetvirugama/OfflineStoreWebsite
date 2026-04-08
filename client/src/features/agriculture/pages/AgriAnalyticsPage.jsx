import React, { useEffect, useState } from 'react';
import useCropStore from '@features/agriculture/crop/crop.store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Filter } from 'lucide-react';
import '@/styles/agriIntelligence.css';

const AgriAnalyticsPage = () => {
    const { trends, fetchCropTrends, loading, error, aiAnalysis, seasonal, fetchAIInsights, fetchSeasonalSuggestions } = useCropStore();
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [days, setDays] = useState(30);

    const crops = ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Onion', 'Potato'];

    useEffect(() => {
        fetchCropTrends(selectedCrop, days);
        fetchAIInsights(selectedCrop);
        fetchSeasonalSuggestions();
    }, [selectedCrop, days, fetchCropTrends, fetchAIInsights, fetchSeasonalSuggestions]);

    return (
        <div className="agri-page">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
                <div>
                    <h1 className="agri-title">Market Intel Analytics</h1>
                    <p style={{opacity: 0.5, fontSize: '0.95rem'}}>Predictive indexing and price telemetry.</p>
                </div>
                
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <button 
                        onClick={() => window.location.href = `/admin/agri/crop/${selectedCrop}`}
                        className="agri-card hover-bg" 
                        style={{
                            padding: '0.5rem 1.2rem', 
                            background: 'var(--agri-green)', 
                            border: 'none', 
                            color: '#fff', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            borderRadius: '0.8rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        Explore Asset
                    </button>

                    <div className="agri-card" style={{padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1rem'}}>
                            <Filter size={16} className="agri-green" />
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'}}
                            >
                                {crops.map(c => <option key={c} value={c} style={{background: '#022c22'}}>{c}</option>)}
                            </select>
                        </div>
                        <select 
                            value={days} 
                            onChange={(e) => setDays(e.target.value)}
                            style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 500, opacity: 0.7, fontSize: '0.85rem'}}
                        >
                            <option value={7} style={{background: '#022c22'}}>7D Index</option>
                            <option value={30} style={{background: '#022c22'}}>30D Index</option>
                            <option value={90} style={{background: '#022c22'}}>90D Index</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading && (
                <div style={{textAlign: 'center', padding: '6rem 0'}}>
                    <div className="spinner" style={{width: '30px', height: '30px', margin: '0 auto 1.5rem', borderWidth: '3px'}}></div>
                    <p style={{opacity: 0.5}}>Compiling Market Data...</p>
                </div>
            )}

            {!loading && !error && (
            <>
            <div className="stats-grid" style={{gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)'}}>
                <div className="agri-card" style={{padding: '1.5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                        <div style={{display: 'flex', gap: '0.8rem', alignItems: 'center'}}>
                            <TrendingUp className="agri-green" size={20} />
                            <h3 style={{fontSize: '1.1rem'}}>Asset Velocity</h3>
                        </div>
                        {seasonal && (
                            <span style={{fontSize: '0.75rem', opacity: 0.5, border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '1rem'}}>
                                PHASE: {seasonal.season.toUpperCase()}
                            </span>
                        )}
                    </div>
                    
                    <div className="trend-container" style={{height: '280px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="rgba(255,255,255,0.2)" 
                                    tick={{fontSize: 9}}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.2)" 
                                    tick={{fontSize: 9}}
                                    domain={['auto', 'auto']}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.8rem', fontSize: '0.8rem'}}
                                    itemStyle={{color: '#10b981'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorPrice)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="agri-card" style={{display: 'flex', flexDirection: 'column', padding: '1.5rem'}}>
                    <div style={{display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '2rem'}}>
                        <BarChart3 className="agri-accent" size={20} />
                        <h3 style={{fontSize: '1.1rem'}}>Market Index</h3>
                    </div>
                    {trends.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                            <div>
                                <h4 style={{opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>Equilibrium Price</h4>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
                                    <span style={{fontSize: '3rem', fontWeight: 800}}>₹{trends[trends.length - 1]?.price}</span>
                                    <span style={{fontSize: '0.9rem', opacity: 0.4}}>INR/Q</span>
                                </div>
                            </div>
                            {trends.length > 1 && (
                                <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div>
                                            <h4 style={{opacity: 0.4, fontSize: '0.7rem', marginBottom: '0.3rem'}}>TEMPORAL SHIFT</h4>
                                            <div style={{
                                                fontSize: '1.4rem', 
                                                fontWeight: 800, 
                                                color: trends[trends.length - 1].price >= trends[0].price ? '#10b981' : '#ef4444'
                                            }}>
                                                {trends[trends.length - 1].price >= trends[0].price ? '+' : ''}
                                                {((trends[trends.length-1].price - trends[0].price) / trends[0].price * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: trends[trends.length - 1].price >= trends[0].price ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                            color: trends[trends.length - 1].price >= trends[0].price ? '#10b981' : '#ef4444'
                                        }}>
                                            <TrendingUp size={18} style={{transform: trends[trends.length - 1].price >= trends[0].price ? 'none' : 'rotate(180deg)'}} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p style={{opacity: 0.4, fontSize: '0.9rem'}}>Awaiting stream...</p>
                    )}
                </div>
            </div>

            <div className="stats-grid" style={{marginTop: '2rem'}}>
                {aiAnalysis && (
                    <div className="agri-card" style={{background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid var(--agri-green)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h4 style={{fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                                <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981'}}></div>
                                AI Outlook
                            </h4>
                            <span style={{fontSize: '0.75rem', fontWeight: 900, color: aiAnalysis.outlook.includes('Bullish') ? '#34d399' : '#f87171'}}>
                                {aiAnalysis.outlook.toUpperCase()}
                            </span>
                        </div>
                        <p style={{fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.7}}>{aiAnalysis.ai_recommendation}</p>
                    </div>
                )}

                {seasonal && (
                    <div className="agri-card" style={{background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid var(--agri-accent)'}}>
                        <h4 style={{fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                             <Calendar className="agri-accent" size={18} /> Adaptive Focus
                        </h4>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.6rem'}}>
                            {seasonal.crops.map(crop => (
                                <div key={crop} style={{
                                    background: 'rgba(245, 158, 11, 0.05)', 
                                    border: '1px solid rgba(245, 158, 11, 0.1)',
                                    color: 'var(--agri-accent)', 
                                    padding: '0.4rem 0.8rem', 
                                    borderRadius: '0.6rem', 
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                }}>
                                    {crop}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
};

export default AgriAnalyticsPage;
