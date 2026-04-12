import React from 'react';
import { History, ChevronRight } from 'lucide-react';

const ActivityPulse = ({ advisory, loading }) => {
    const actions = Array.isArray(advisory?.advisory) ? advisory.advisory : [];

    return (
        <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', fontWeight: 800 }}>
                <History className="agri-green" /> Strategic Activity Pulse
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {loading ? [1, 2, 3].map(i => (
                    <div key={i} style={{ padding: '1.5rem', borderRadius: '24px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.03)', height: '80px', opacity: 0.5 }}></div>
                )) : actions.length > 0 ? actions.map((h, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', borderRadius: '24px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <div style={{ padding: '0.8rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                            <ChevronRight className="agri-green" size={20} />
                        </div>
                        <div>
                            <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', margin: 0 }}>{h.message}</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--agri-green)', fontWeight: 900, marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                ACTION REQUIRED • PRIORITY {idx + 1}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.3, fontWeight: 800 }}>
                        <p>No immediate actions required for current telemetry.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPulse;
