import React, { useEffect, useState } from 'react';
import { useCropStore } from '../../store/cropStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Filter } from 'lucide-react';
import '../../styles/agriIntelligence.css';

const AgriAnalyticsPage = () => {
    const { trends, fetchCropTrends, loading, error } = useCropStore();
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [days, setDays] = useState(30);

    const crops = ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Onion', 'Potato'];

    useEffect(() => {
        fetchCropTrends(selectedCrop, days);
    }, [selectedCrop, days, fetchCropTrends]);

    return (
        <div className="agri-page">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                <div>
                    <h1 className="agri-title">Market Intel Analytics</h1>
                    <p style={{opacity: 0.7}}>Predictive price trends and historical data analysis.</p>
                </div>
                
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className="agri-card" style={{padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        <Filter size={18} className="agri-green" />
                        <select 
                            value={selectedCrop} 
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer'}}
                        >
                            {crops.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="agri-card" style={{padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                         <select 
                            value={days} 
                            onChange={(e) => setDays(e.target.value)}
                            style={{background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer'}}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading && <div className="agri-card" style={{textAlign: 'center', padding: '4rem'}}>Compiling Agriculture Intelligence...</div>}
            {error && <div className="agri-card" style={{textAlign: 'center', padding: '4rem', color: '#f87171'}}>⚠️ {error}</div>}

            {!loading && !error && (
            <div className="stats-grid">
                <div className="agri-card" style={{gridColumn: 'span 2'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem'}}>
                        <TrendingUp className="agri-green" />
                        <h3>Price Trend (Modal Price)</h3>
                    </div>
                    
                    <div className="trend-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="rgba(255,255,255,0.5)" 
                                    tick={{fontSize: 12}}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.5)" 
                                    tick={{fontSize: 12}}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip 
                                    contentStyle={{background: '#1f2937', border: '1px solid var(--glass-border)', borderRadius: '1rem'}}
                                    itemStyle={{color: '#10b981'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorPrice)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="agri-card">
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem'}}>
                        <BarChart3 className="agri-accent" />
                        <h3>Market Insight</h3>
                    </div>
                    {trends.length > 1 ? (
                        <div>
                            <div style={{marginBottom: '2rem'}}>
                                <h4 style={{opacity: 0.6}}>Latest Entry</h4>
                                <p style={{fontSize: '2rem', fontWeight: 700}}>₹{trends[trends.length - 1].price}</p>
                            </div>
                            <div>
                                <h4 style={{opacity: 0.6}}>Weekly Change</h4>
                                <p style={{
                                    fontSize: '1.5rem', 
                                    fontWeight: 600, 
                                    color: trends[trends.length - 1].price >= trends[0].price ? '#10b981' : '#ef4444'
                                }}>
                                    {((trends[trends.length-1].price - trends[0].price) / trends[0].price * 100).toFixed(1)}%
                                    {trends[trends.length-1].price >= trends[0].price ? ' ↗' : ' ↘'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p>No enough data to show insights.</p>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default AgriAnalyticsPage;
