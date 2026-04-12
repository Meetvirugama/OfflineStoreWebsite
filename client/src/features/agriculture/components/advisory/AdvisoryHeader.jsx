import React from 'react';
import { Target, ShieldCheck } from 'lucide-react';

const AdvisoryHeader = ({ syncStatus }) => {
    return (
        <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
                <h1 className="agri-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)', flexShrink: 0}}>
                        <Target className="agri-green" size={32} />
                    </div>
                    Smart Mandi Hub + Advisory
                </h1>
                <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={18} className="agri-green" />
                    AI-powered regional intelligence combining weather and market velocity.
                </p>
            </div>
            <div className="weather-badge glass-card" style={{ padding: '0.8rem 1.5rem', borderRadius: '1.5rem', fontWeight: 800, letterSpacing: '1px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="pulse-green" style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
                {syncStatus === 'SYNCED' ? 'SENSOR SYNC ACTIVE' : syncStatus.toUpperCase()}
            </div>
        </header>
    );
};

export default AdvisoryHeader;
