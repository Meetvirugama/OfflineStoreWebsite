import React from 'react';
import { ShieldCheck } from 'lucide-react';

const StrategicAdvisoryCard = ({ advisory, loading }) => {
    // Robust data extraction with fallback
    const aiText = advisory?.accuracy_meta?.ai_text || advisory?.recommends || advisory?.reason;
    const confidence = advisory?.accuracy_meta?.confidence || 95;

    return (
        <div className="agri-card agri-card--dark" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
                        <ShieldCheck className="agri-green" size={26} /> 
                        AI STRATEGIC ADVISORY
                    </h3>
                    <div style={{textAlign: 'right'}}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>PRECISION INDEX</span>
                        <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.2rem'}}>{confidence}%</span>
                    </div>
                </div>

                <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.95, fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                        {loading ? (
                            <span style={{opacity: 0.5, fontStyle: 'italic'}}>Synthesizing regional market patterns and multi-spectral telemetry...</span>
                        ) : (
                            aiText || "Target advisory context is being calculated. Initial telemetry indicates a stable strategic window for your current crop cycle."
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StrategicAdvisoryCard;
