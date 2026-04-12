import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const RiskAssessmentList = ({ advisory }) => {
    const risks = advisory?.accuracy_meta?.risks_raw || [];

    return (
        <div className="agri-card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                <TrendingUp className="agri-green" size={24} /> AI Risk Assessment
            </h3>
            {risks.length > 0 ? (
                risks.map((risk, idx) => (
                    <div key={idx} style={{ padding: '1.2rem', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '20px', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(185, 28, 28, 0.1)', borderRadius: '10px' }}>
                            <AlertTriangle size={18} />
                        </div>
                        {risk}
                    </div>
                ))
            ) : (
                <div style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '24px', gap: '0.8rem' }}>
                    <ShieldCheck size={32} />
                    <p style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>NO STRATEGIC RISKS DETECTED</p>
                </div>
            )}
        </div>
    );
};

export default RiskAssessmentList;
