import React, { useEffect, useState } from 'react';
import useCropStore from '@features/agriculture/crop/crop.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Filter, Calendar } from 'lucide-react';
import DynText from '@core/i18n/DynText';
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

    return (
        <div className="agri-page">
            <div className="agri-page__header" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
                <div>
                    <h1 className="agri-title"><DynText text="Market Intel Analytics" /></h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem', flexWrap: 'wrap'}}>
                        <p style={{opacity: 0.5, fontSize: '0.85rem', margin: 0}}><DynText text="Predictive indexing and price telemetry." /></p>
                        {selectedLocation && (
                            <span style={{
                                fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', 
                                border: '1px solid #10b981', borderRadius: '1rem', color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap'
                            }}>
                                <DynText text="SYNC" />: <DynText text={selectedLocation.name.toUpperCase()} />
                            </span>
                        )}
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => window.location.href = `/admin/agri/crop/${selectedCrop}`}
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
                        <DynText text="Explore Asset" />
                    </button>

                    <div className="agri-card" style={{padding: '0.4rem 0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'center', background: '#f1f5f9', flexWrap: 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '0.6rem'}}>
                            <Filter size={14} className="agri-green" />
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'}}
                            >
                                {crops.map(c => <option key={c} value={c} style={{background: '#ffffff', color: '#1e293b'}}><DynText text={c} /></option>)}
                            </select>
                        </div>
                        <select 
                            value={days} 
                            onChange={(e) => setDays(e.target.value)}
                            style={{background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 500, opacity: 0.7, fontSize: '0.8rem'}}
                        >
                            <option value={7} style={{background: '#ffffff', color: '#1e293b'}}><DynText text="7D" /></option>
                            <option value={30} style={{background: '#ffffff', color: '#1e293b'}}><DynText text="30D" /></option>
                            <option value={90} style={{background: '#ffffff', color: '#1e293b'}}><DynText text="90D" /></option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading && (
                <div style={{textAlign: 'center', padding: '6rem 0'}}>
                    <div className="spinner" style={{width: '30px', height: '30px', margin: '0 auto 1.5rem', borderWidth: '3px'}}></div>
                    <p style={{opacity: 0.5}}><DynText text="Compiling Market Data" />...</p>
                </div>
            )}

            {!loading && !error && (
            <>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem'}}>
                <div className="agri-card" style={{padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
                        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px'}}>
                                <TrendingUp className="agri-green" size={24} />
                            </div>
                            <div>
                                <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px'}}><DynText text="Asset Velocity" /></h3>
                                <p style={{fontSize: '0.75rem', opacity: 0.4, margin: '2px 0 0', letterSpacing: '0.5px', fontWeight: 700}}><DynText text="TEMPORAL PRICE TELEMETRY" /></p>
                            </div>
                        </div>
                        {seasonal && (
                            <div style={{textAlign: 'right'}}>
                                <span style={{fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, letterSpacing: '1px', display: 'block', marginBottom: '4px'}}><DynText text="CURRENT PHASE" /></span>
                                <span style={{fontSize: '0.85rem', color: 'var(--agri-green)', fontWeight: 900, background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                                    <DynText text={seasonal.season.toUpperCase()} />
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div style={{height: 'clamp(200px, 40vw, 350px)', marginTop: '1rem'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends || []}>
                                <defs>
                                    <linearGradient id="velocityGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="rgba(255,255,255,0.3)" 
                                    tick={{fontSize: 11, fontWeight: 600}}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={15}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.3)" 
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
                                    stroke="var(--agri-green)" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#velocityGlow)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="agri-card" style={{display: 'flex', flexDirection: 'column', padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem'}}>
                        <div style={{padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '14px'}}>
                            <BarChart3 className="agri-accent" size={24} />
                        </div>
                        <div>
                            <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px'}}><DynText text="Predictive Index" /></h3>
                            <p style={{fontSize: '0.75rem', opacity: 0.4, margin: '2px 0 0', letterSpacing: '0.5px', fontWeight: 700}}><DynText text="MARKET EQUILIBRIUM" /></p>
                        </div>
                    </div>
                    {(trends || []).length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '3rem', flex: 1}}>
                            <div style={{background: 'rgba(0,0,0,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)'}}>
                                <h4 style={{opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', fontWeight: 800}}><DynText text="Live Trading Price" /></h4>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.8rem'}}>
                                    <span style={{fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'inherit'}}>₹{trends[trends.length - 1]?.price}</span>
                                    <span style={{fontSize: '1.2rem', opacity: 0.3, fontWeight: 700}}><DynText text="INR/Q" /></span>
                                </div>
                            </div>
                            {(trends || []).length > 1 && (
                                <div style={{padding: '1rem 0'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div>
                                            <h4 style={{opacity: 0.4, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem'}}><DynText text="VOLATILITY SHIFT" /></h4>
                                            <div style={{
                                                fontSize: '2.4rem', 
                                                fontWeight: 900, 
                                                color: (trends[trends.length - 1]?.price ?? 0) >= (trends[0]?.price ?? 0) ? '#10b981' : '#ef4444',
                                                letterSpacing: '-1px'
                                            }}>
                                                {(trends[trends.length - 1]?.price ?? 0) >= (trends[0]?.price ?? 0) ? '+' : ''}
                                                {((((trends[trends.length-1]?.price ?? 0) - (trends[0]?.price ?? 0)) / (trends[0]?.price || 1)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '20px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: (trends[trends.length - 1]?.price ?? 0) >= (trends[0]?.price ?? 0) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: (trends[trends.length - 1]?.price ?? 0) >= (trends[0]?.price ?? 0) ? '#10b981' : '#ef4444',
                                            border: '1px solid currentColor'
                                        }}>
                                            <TrendingUp size={32} style={{transform: (trends[trends.length - 1]?.price ?? 0) >= (trends[0]?.price ?? 0) ? 'none' : 'rotate(180deg)'}} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2}}>
                            <p><DynText text="Awaiting Price Stream" />...</p>
                        </div>
                    )}
                </div>
            </div>

            <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem'}}>
                {aiAnalysis && (
                    <div className="agri-card" style={{padding: '2.5rem', background: 'rgba(16, 185, 129, 0.03)', borderLeft: '6px solid var(--agri-green)', borderRadius: '32px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                            <h4 style={{fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <div style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981'}}></div>
                                <DynText text="AI Strategic Outlook" />
                            </h4>
                            <span style={{fontSize: '0.85rem', fontWeight: 900, color: aiAnalysis.outlook.includes('Bullish') ? '#10b981' : '#ef4444', letterSpacing: '1px', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 1rem', borderRadius: '8px'}}>
                                <DynText text={aiAnalysis.outlook.toUpperCase()} />
                            </span>
                        </div>
                        <p style={{fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.8, fontWeight: 500}}><DynText text={aiAnalysis.ai_recommendation} /></p>
                    </div>
                )}

                {seasonal && (
                    <div className="agri-card" style={{padding: '2.5rem', background: 'rgba(245, 158, 11, 0.03)', borderLeft: '6px solid var(--agri-accent)', borderRadius: '32px'}}>
                        <h4 style={{fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <Calendar className="agri-accent" size={24} /> <DynText text="Seasonal Pivot Strategy" />
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
                                    <DynText text={crop.toUpperCase()} />
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
