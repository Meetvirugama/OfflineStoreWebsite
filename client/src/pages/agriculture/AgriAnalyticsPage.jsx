import React, { useEffect, useState } from 'react';
import { useCropStore } from '../../store/cropStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Filter } from 'lucide-react';
import '../../styles/agriIntelligence.css';

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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem'}}>
                <div>
                    <h1 className="agri-title">Market Intel Analytics</h1>
                    <p style={{opacity: 0.6, fontSize: '1.2rem'}}>High-fidelity predictive telemetry and historical price indexing.</p>
                </div>
                
                <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                    <button 
                        onClick={() => window.location.href = `/admin/agri/crop/${selectedCrop}`}
                        className="agri-card hover-bg" 
                        style={{
                            padding: '0.8rem 2rem', 
                            background: 'var(--agri-green)', 
                            border: 'none', 
                            color: '#fff', 
                            fontWeight: 800, 
                            cursor: 'pointer',
                            borderRadius: '1.2rem',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.3s'
                        }}
                    >
                        View {selectedCrop} Identity Explorer
                    </button>

                    <div className="agri-card" style={{padding: '0.8rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1.5rem'}}>
                            <Filter size={20} className="agri-green" />
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem'}}
                            >
                                {crops.map(c => <option key={c} value={c} style={{background: '#022c22'}}>{c}</option>)}
                            </select>
                        </div>
                        <select 
                            value={days} 
                            onChange={(e) => setDays(e.target.value)}
                            style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 600, opacity: 0.8}}
                        >
                            <option value={7} style={{background: '#022c22'}}>Last 7 Days</option>
                            <option value={30} style={{background: '#022c22'}}>Last 30 Days</option>
                            <option value={90} style={{background: '#022c22'}}>Last 90 Days</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading && (
                <div style={{textAlign: 'center', padding: '12rem 0'}}>
                    <div className="spinner" style={{width: '50px', height: '50px', margin: '0 auto 2rem', borderWidth: '4px'}}></div>
                    <h2 style={{fontWeight: 800}}>Aggregating Market Geometries...</h2>
                </div>
            )}

            {!loading && !error && (
            <>
            <div className="stats-grid">
                <div className="agri-card" style={{gridColumn: 'span 2', padding: '3rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem'}}>
                                <TrendingUp className="agri-green" size={24} />
                            </div>
                            <div>
                                <h3 style={{fontSize: '1.5rem'}}>Asset Price Velocity</h3>
                                <p style={{fontSize: '0.85rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Daily Modal Price (INR/Quintal)</p>
                            </div>
                        </div>
                        {seasonal && (
                            <div className="weather-badge">
                                <Calendar size={16} /> Seasonal Phase: {seasonal.season}
                            </div>
                        )}
                    </div>
                    
                    <div className="trend-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="rgba(255,255,255,0.3)" 
                                    tick={{fontSize: 11}}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.3)" 
                                    tick={{fontSize: 11}}
                                    domain={['auto', 'auto']}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.2rem', padding: '1.2rem'}}
                                    itemStyle={{color: '#10b981', fontWeight: 800}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#10b981" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorPrice)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="agri-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '3rem'}}>
                         <div style={{padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '1rem'}}>
                            <BarChart3 className="agri-accent" size={24} />
                        </div>
                        <h3 style={{fontSize: '1.5rem'}}>Volatility Index</h3>
                    </div>
                    {trends.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
                            <div>
                                <h4 style={{opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '1rem'}}>Market Equilibrium</h4>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '1rem'}}>
                                    <span style={{fontSize: '4.5rem', fontWeight: 900}}>₹{trends[trends.length - 1]?.price}</span>
                                    <span style={{fontSize: '1.2rem', opacity: 0.5, fontWeight: 700}}>INR/Q</span>
                                </div>
                            </div>
                            {trends.length > 1 && (
                                <div className="agri-card" style={{background: 'rgba(255,255,255,0.02)', padding: '1.5rem'}}>
                                    <h4 style={{opacity: 0.5, fontSize: '0.8rem', marginBottom: '0.8rem'}}>Temporal Displacement</h4>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div style={{
                                            fontSize: '2rem', 
                                            fontWeight: 900, 
                                            color: trends[trends.length - 1].price >= trends[0].price ? '#10b981' : '#ef4444'
                                        }}>
                                            {trends[trends.length - 1].price >= trends[0].price ? '+' : ''}
                                            {((trends[trends.length-1].price - trends[0].price) / trends[0].price * 100).toFixed(1)}%
                                        </div>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: trends[trends.length - 1].price >= trends[0].price ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: trends[trends.length - 1].price >= trends[0].price ? '#10b981' : '#ef4444'
                                        }}>
                                            <TrendingUp size={24} style={{transform: trends[trends.length - 1].price >= trends[0].price ? 'none' : 'rotate(180deg)'}} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p style={{opacity: 0.5}}>Awaiting telemetry stream...</p>
                    )}
                </div>
            </div>

            <div className="stats-grid" style={{marginTop: '3rem'}}>
                {aiAnalysis && (
                    <div className="agri-card" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)', borderLeft: '5px solid var(--agri-green)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                            <h4 style={{fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                                <span style={{width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #10b981'}}></span>
                                Neuro-Analytics Outlook
                            </h4>
                            <div style={{
                                background: aiAnalysis.outlook.includes('Bullish') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: aiAnalysis.outlook.includes('Bullish') ? '#34d399' : '#f87171',
                                padding: '0.4rem 1rem', borderRadius: '0.8rem', fontWeight: 900, fontSize: '0.85rem'
                            }}>
                                {aiAnalysis.outlook.toUpperCase()}
                            </div>
                        </div>
                        <p style={{fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8, fontWeight: 500}}>{aiAnalysis.ai_recommendation}</p>
                        <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontSize: '0.75rem', opacity: 0.4}}>CONFIDENCE PROBABILITY</span>
                            <span style={{fontWeight: 900, color: 'var(--agri-green-light)', fontSize: '1.1rem'}}>{aiAnalysis.confidence_score}</span>
                        </div>
                    </div>
                )}

                {seasonal && (
                    <div className="agri-card" style={{background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)', borderLeft: '5px solid var(--agri-accent)'}}>
                        <h4 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                             <Calendar className="agri-accent" size={20} /> Adaptive Crop Recommendations
                        </h4>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2rem'}}>
                            {seasonal.crops.map(crop => (
                                <div key={crop} style={{
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    color: '#fff', 
                                    padding: '0.6rem 1.2rem', 
                                    borderRadius: '1rem', 
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    {crop}
                                </div>
                            ))}
                        </div>
                        <p style={{fontSize: '0.9rem', opacity: 0.6, lineHeight: 1.6}}>Growth patterns optimized for current climatic and seasonal phase: <strong>{seasonal.season}</strong>.</p>
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
};

export default AgriAnalyticsPage;
