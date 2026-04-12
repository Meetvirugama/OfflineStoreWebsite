import React, { useEffect, useState } from 'react';
import useCropStore from '@features/agriculture/crop/crop.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Filter, Calendar } from 'lucide-react';
import '@/styles/agriIntelligence.css';

const AgriAnalyticsPage = () => {
    const { 
        crops, fetchCrops, trends, fetchCropTrends, loading, error, 
        aiAnalysis, seasonal, fetchAIInsights, fetchSeasonalSuggestions 
    } = useCropStore();
    const { selectedLocation, initialize } = useWeatherStore();
    
    const [selectedCrop, setSelectedCrop] = useState('');
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchCrops();
        fetchSeasonalSuggestions();
        initialize?.();
    }, [fetchCrops, fetchSeasonalSuggestions, initialize]);

    useEffect(() => {
        if (crops.length > 0 && !selectedCrop) {
            setSelectedCrop(crops[0]);
        }
    }, [crops, selectedCrop]);

    useEffect(() => {
        if (selectedCrop) {
            fetchCropTrends(selectedCrop, days);
            fetchAIInsights(selectedCrop);
        }
    }, [selectedCrop, days, fetchCropTrends, fetchAIInsights]);

    // Computed Logic to avoid build-time JSX complexity errors
    const lastPrice = trends?.[trends.length - 1]?.price ?? 0;
    const firstPrice = trends?.[0]?.price ?? 0;
    const isBullish = lastPrice >= firstPrice;
    const trendColor = isBullish ? '#10b981' : '#f59e0b';
    const trendLabel = isBullish ? 'BULLISH' : 'BEARISH';
    const trendBg = isBullish ? '#d1fae5' : '#fee2e2';
    const trendText = isBullish ? '#065f46' : '#991b1b';

    const signalColor = aiAnalysis?.signal === 'BUY' || aiAnalysis?.signal === 'HOLD' ? '#10b981' : '#f59e0b';
    const riskColor = aiAnalysis?.risk === 'HIGH' ? '#f43f5e' : (aiAnalysis?.risk === 'MEDIUM' ? '#f59e0b' : '#10b981');
    const velocityWidth = aiAnalysis?.velocity === 'HIGH' ? '100%' : (aiAnalysis?.velocity === 'MEDIUM' ? '60%' : '30%');
    const velocityColor = aiAnalysis?.velocity === 'HIGH' ? '#10b981' : (aiAnalysis?.velocity === 'MEDIUM' ? '#f59e0b' : '#94a3b8');

    return (
        <div className="agri-page">
            <div className="agri-page__header" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
                <div>
                    <h1 className="agri-title">Market Intel Analytics</h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem', flexWrap: 'wrap'}}>
                        <p style={{opacity: 0.5, fontSize: '0.85rem', margin: 0}}>Predictive indexing and price telemetry.</p>
                        {selectedLocation && (
                            <span style={{
                                fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', 
                                border: '1px solid #10b981', borderRadius: '1rem', color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap'
                            }}>
                                SYNC: {selectedLocation.name.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => window.location.href = `/intelligence/agri/crop/${selectedCrop}`}
                        className="agri-card hover-bg" 
                        style={{
                            padding: '0.5rem 1rem', 
                            background: 'var(--agri-green)', 
                            border: 'none', 
                            color: '#fff', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            borderRadius: '0.8rem',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Explore Asset
                    </button>

                    <div className="agri-card" style={{padding: '0.4rem 0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'center', background: '#f1f5f9', flexWrap: 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '0.6rem'}}>
                            <Filter size={14} className="agri-green" />
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'}}
                            >
                                {crops.map(c => <option key={c} value={c} style={{background: '#ffffff', color: '#1e293b'}}>{c}</option>)}
                            </select>
                        </div>
                        <select 
                            value={days} 
                            onChange={(e) => setDays(e.target.value)}
                            style={{background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 500, opacity: 0.7, fontSize: '0.8rem'}}
                        >
                            <option value={7} style={{background: '#ffffff', color: '#1e293b'}}>7D</option>
                            <option value={30} style={{background: '#ffffff', color: '#1e293b'}}>30D</option>
                            <option value={90} style={{background: '#ffffff', color: '#1e293b'}}>90D</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div style={{textAlign: 'center', padding: '6rem 0'}}>
                    <div className="spinner" style={{width: '30px', height: '30px', margin: '0 auto 1.5rem', borderWidth: '3px'}}></div>
                    <p style={{opacity: 0.5}}>Compiling Market Data...</p>
                </div>
            ) : error ? (
                <div style={{textAlign: 'center', padding: '6rem 0', color: '#f43f5e'}}>
                    <p>Failed to load market analytics.</p>
                </div>
            ) : (
                <React.Fragment>
                    <div className="stats-grid" style={{marginTop: '1.5rem'}}>
                        {/* CARD 1: ASSET VELOCITY */}
                        <div className="agri-card glass-card" style={{padding: '2.5rem', borderRadius: '32px', gridColumn: 'span 2'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px'}}>
                                        <TrendingUp className="agri-green" size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px'}}>Asset Velocity</h3>
                                        <p style={{fontSize: '0.75rem', opacity: 0.4, margin: '2px 0 0', letterSpacing: '0.5px', fontWeight: 700}}>TEMPORAL PRICE TELEMETRY</p>
                                    </div>
                                </div>
                                {seasonal && (
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, letterSpacing: '1px', display: 'block', marginBottom: '4px'}}>CURRENT PHASE</span>
                                        <span style={{fontSize: '0.85rem', color: 'var(--agri-green)', fontWeight: 900, background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                                            {seasonal.season.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={{height: 'clamp(200px, 40vw, 350px)', marginTop: '1rem'}}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trends?.length === 1 ? [{...trends[0], date: 'T-1'}, trends[0]] : (trends || [])}>
                                        <defs>
                                            <linearGradient id="velocityGlow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={trendColor} stopOpacity={0.25}/>
                                                <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="rgba(0,0,0,0.3)" 
                                            tick={{fontSize: 11, fontWeight: 600}}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={15}
                                        />
                                        <YAxis 
                                            stroke="rgba(0,0,0,0.3)" 
                                            tick={{fontSize: 11, fontWeight: 600}}
                                            domain={['auto', 'auto']}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(val) => `₹${val}`}
                                        />
                                        <Tooltip 
                                            contentStyle={{background: '#ffffff', border: '1px solid var(--agri-green)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem'}}
                                            itemStyle={{color: '#1e293b', fontWeight: 800}}
                                            labelStyle={{color: 'rgba(0,0,0,0.4)', fontSize: '0.7rem', marginBottom: '4px'}}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke={trendColor} 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#velocityGlow)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CARD 2: PREDICTIVE INDEX */}
                        <div className="agri-card premium-panel" style={{display: 'flex', flexDirection: 'column', padding: '2.5rem', borderRadius: '32px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <div style={{padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '14px'}}>
                                        <BarChart3 className="agri-accent" size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px'}}>Predictive Index</h3>
                                        <p style={{fontSize: '0.75rem', opacity: 0.4, margin: '2px 0 0', letterSpacing: '0.5px', fontWeight: 700}}>MARKET EQUILIBRIUM</p>
                                    </div>
                                </div>
                                {aiAnalysis?.confidence && (
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{fontSize: '0.65rem', opacity: 0.4, fontWeight: 900, display: 'block'}}>AI CONFIDENCE</span>
                                        <span className="agri-green" style={{fontSize: '1.1rem', fontWeight: 900}}>{aiAnalysis.confidence}%</span>
                                    </div>
                                )}
                            </div>

                            {trends?.length > 0 ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1}}>
                                    <div style={{background: 'rgba(0,0,0,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                            <h4 style={{opacity: 0.4, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase'}}>Live Trading Price</h4>
                                            <div style={{
                                                padding: '0.3rem 0.8rem', background: trendBg,
                                                borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 900, color: trendText
                                            }}>
                                                {trendLabel}
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'baseline', gap: '0.8rem'}}>
                                            <span style={{fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, letterSpacing: '-2px'}}>₹{lastPrice}</span>
                                            <span style={{fontSize: '1rem', opacity: 0.3, fontWeight: 700}}>INR/Q</span>
                                        </div>
                                    </div>

                                    <div style={{padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                            <h4 style={{opacity: 0.6, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase'}}>Momentum Velocity</h4>
                                            <span style={{fontSize: '0.75rem', fontWeight: 900, color: velocityColor}}>{aiAnalysis?.velocity || 'STABLE'}</span>
                                        </div>
                                        <div style={{height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden'}}>
                                            <div style={{
                                                width: velocityWidth,
                                                height: '100%',
                                                background: velocityColor,
                                                borderRadius: '10px',
                                                transition: 'width 1s ease-out'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2}}>
                                    <p>Awaiting Price Stream...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem'}}>
                        {aiAnalysis && (
                            <div className="agri-card agri-card--dark" style={{padding: '2.5rem', borderLeft: `6px solid ${signalColor}`, borderRadius: '32px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1}}>
                                    <h4 style={{fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                        <div className="pulse-green" style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981'}}></div>
                                        AI Strategic Outlook
                                    </h4>
                                    <div style={{display: 'flex', gap: '0.8rem'}}>
                                        <span style={{fontSize: '0.85rem', fontWeight: 900, color: '#f8fafc', opacity: 0.7, background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)'}}>
                                            PRECISION: {aiAnalysis.confidence || 95}%
                                        </span>
                                        <span style={{
                                            fontSize: '0.85rem', fontWeight: 900, 
                                            color: riskColor, 
                                            background: 'rgba(0,0,0,0.2)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid currentColor'
                                        }}>
                                            RISK: {aiAnalysis.risk || 'LOW'}
                                        </span>
                                        <span style={{fontSize: '0.85rem', fontWeight: 900, color: '#fff', background: signalColor, padding: '0.4rem 1rem', borderRadius: '2rem'}}>
                                            SIGNAL: {aiAnalysis.signal?.toUpperCase() || 'HOLD'}
                                        </span>
                                    </div>
                                </div>
                                <p style={{fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.9, fontWeight: 500, position: 'relative', zIndex: 1}}>{aiAnalysis.ai_recommendation || aiAnalysis.reason}</p>
                            </div>
                        )}

                        {seasonal && (
                            <div className="agri-card glass-card" style={{padding: '2.5rem', borderLeft: '6px solid var(--agri-accent)', borderRadius: '32px'}}>
                                <h4 style={{fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b'}}>
                                    <Calendar className="agri-accent pulse-green" size={24} /> Seasonal Pivot Strategy
                                </h4>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.8rem'}}>
                                    {(seasonal?.crops || []).map(crop => (
                                        <div key={crop} style={{
                                            background: 'rgba(245, 158, 11, 0.1)', 
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            color: 'var(--agri-accent)', 
                                            padding: '0.6rem 1.4rem', 
                                            borderRadius: '14px', 
                                            fontSize: '0.9rem',
                                            fontWeight: 900,
                                            letterSpacing: '0.5px'
                                        }}>
                                            {crop.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default AgriAnalyticsPage;
