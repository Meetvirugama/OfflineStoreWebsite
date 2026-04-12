import React from 'react';
import { MapPin, Navigation, Loader2, ShieldCheck } from 'lucide-react';

const TelemetryForm = ({ formData, setFormData, syncStatus, onDetect, onGenerate, loading, crops, stages }) => {
    return (
        <div className="agri-card glass-card" style={{ padding: '2.5rem', borderRadius: '32px' }}>
            <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
                <div className="pulse-green" style={{width: '6px', height: '24px', background: 'var(--agri-green)', borderRadius: '4px'}}></div>
                Telemetry Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>IDENTIFIED CROP</label>
                    <select 
                        value={formData.crop}
                        onChange={(e) => setFormData({...formData, crop: e.target.value})}
                        style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {crops.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>GROWTH VELOCITY</label>
                    <select 
                        value={formData.stage}
                        onChange={(e) => setFormData({...formData, stage: e.target.value})}
                        style={{ width: '100%', padding: '1.2rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {stages.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, letterSpacing: '1.5px' }}>SPATIAL CONTEXT</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                            <input 
                                type="text"
                                placeholder="City / Village Index"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value, lat: null, lon: null})}
                                style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}
                            />
                        </div>
                        <button 
                            onClick={onDetect}
                            style={{ padding: '0', width: '4.2rem', height: '4.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', cursor: 'pointer', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', flexShrink: 0 }}
                        >
                            <Navigation size={22} className="agri-green" />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onGenerate}
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '1.5rem', 
                        marginTop: '1.5rem',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                        color: '#fff',
                        fontWeight: '900',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        border: 'none',
                        borderRadius: '20px',
                        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
                        letterSpacing: '1.2px'
                    }}
                >
                    {loading ? <Loader2 className="spin" size={24} /> : <ShieldCheck size={24} />}
                    {loading ? 'SYNCHRONIZING' : 'INITIALIZE HUB'}
                </button>
            </div>
        </div>
    );
};

export default TelemetryForm;
