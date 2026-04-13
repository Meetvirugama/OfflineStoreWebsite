import React, { useState, useEffect, useRef } from 'react';
import usePestStore from '@features/agriculture/crop/pest.store';
import { 
    Camera, 
    Upload, 
    AlertCircle, 
    CheckCircle2, 
    FlaskConical, 
    Leaf, 
    Clock, 
    ChevronRight,
    Loader2,
    ShieldAlert,
    Info,
    History,
    X,
    Maximize2
} from 'lucide-react';
import '@/styles/agriIntelligence.css';

import { CROP_CATALOG } from '../constants/crops';

const CROPS = CROP_CATALOG;

const PestDetectionPage = () => {
    const { history, loading, error, currentDetection, detectPest, fetchHistory } = usePestStore();
    
    const [selectedCrop, setSelectedCrop] = useState("Cotton");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        const file = fileInputRef.current?.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('crop', selectedCrop);

        try {
            await detectPest(formData);
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444' };
            case 'medium': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b' };
            default: return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981' };
        }
    };

    return (
        <div className="agri-page">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="agri-title">AI Pest & Disease Detection</h1>
                <p style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={16} className="agri-green" />
                    Instant field diagnostics with localized Gujarat Intelligence Layer
                </p>
            </div>

            {/* AI WARNING BANNER */}
            <div className="agri-card" style={{ 
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '1rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <Info size={20} className="agri-green" />
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    <strong>Note:</strong> This is an AI-based advisory tool. We strongly recommend verifying results with an agricultural expert before applying any chemical pesticides.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                
                {/* UPLOAD SECTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="agri-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Camera className="agri-green" /> Diagnostic Input
                        </h3>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Target Crop</label>
                            <select 
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="agri-card"
                                style={{ width: '100%', padding: '0.8rem', background: '#f8fafc', borderRadius: '0.6rem', color: '#1e293b', border: '1px solid rgba(0,0,0,0.08)' }}
                            >
                                {CROPS.map(c => (
                                    <option key={c.id} value={c.name} style={{ background: '#ffffff', color: '#1e293b' }}>
                                        {c.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            style={{ 
                                border: '2px dashed rgba(0,0,0,0.1)', 
                                borderRadius: '1rem', 
                                padding: '3rem 1.5rem', 
                                textAlign: 'center', 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: previewUrl ? `url(${previewUrl}) center/cover no-repeat` : '#f8fafc',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {previewUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}></div>}
                            
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {previewUrl ? (
                                    <div style={{ color: '#fff' }}>
                                        <CheckCircle2 size={48} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
                                        <p>Photo ready for analysis</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                        <p style={{ opacity: 0.6 }}>Tap to Capture or Upload Leaf Photo</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '0.5rem' }}>JPG, PNG up to 5MB</p>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                capture="environment"
                                onChange={handleFileChange}
                            />
                        </div>

                        <button 
                            disabled={loading || !previewUrl}
                            onClick={handleUpload}
                            className="agri-card"
                            style={{ 
                                width: '100%', 
                                padding: '1rem', 
                                marginTop: '1.5rem',
                                background: loading ? 'rgba(16, 185, 129, 0.5)' : (previewUrl ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(255,255,255,0.05)'), 
                                color: '#fff',
                                fontWeight: '900',
                                cursor: (previewUrl && !loading) ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                border: 'none',
                                letterSpacing: '1px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="spin" size={20} />
                                    ANALYZING FIELD DATA...
                                </>
                            ) : (
                                <>
                                    <FlaskConical size={20} />
                                    IDENTIFY DISEASE
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="agri-card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <AlertCircle size={20} />
                            <span style={{ fontSize: '0.9rem' }}>{error}</span>
                        </div>
                    )}
                </div>

                {/* DIAGNOSTIC HISTORY */}
                <div className="agri-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <History size={20} className="agri-green" /> Diagnostic History
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        {history.length > 0 ? history.map((h) => {
                            const sev = getSeverityStyle(h.severity);
                            return (
                                <div key={h.id} className="history-item" style={{ 
                                    padding: '1.2rem', 
                                    borderRadius: '0.8rem', 
                                    background: 'rgba(255,255,255,0.02)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            borderRadius: '0.6rem', 
                                            background: `url(${h.image_url.startsWith('http') ? h.image_url : (import.meta.env.VITE_API_URL?.replace('/api', '') + h.image_url)}) center/cover no-repeat`,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}></div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                                                <h4 style={{ fontSize: '1rem', margin: 0 }}>{h.disease || h.disease_name}</h4>
                                                <span style={{ 
                                                    fontSize: '0.7rem', 
                                                    padding: '0.2rem 0.6rem', 
                                                    borderRadius: '1rem',
                                                    background: sev.bg,
                                                    color: sev.color,
                                                    border: `1px solid ${sev.border}`
                                                }}>
                                                    {h.severity}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                                                {h.crop} • {new Date(h.created_at || h.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }} className="agri-green">{Math.round(h.confidence)}%</p>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.4 }}>Confidence</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.3 }}>
                                <History size={48} style={{ margin: '0 auto 1rem' }} />
                                <p>No previous diagnostics found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RESULTS MODAL */}
            {showModal && currentDetection && (
                <div style={{ 
                    position: 'fixed' , 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(8px)', 
                    zIndex: 1000, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="agri-card" style={{ maxWidth: '800px', width: '100%', padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                            <div style={{ 
                                background: `url(${currentDetection.image_url.startsWith('http') ? currentDetection.image_url : (import.meta.env.VITE_API_URL?.replace('/api', '') + currentDetection.image_url)}) center/cover no-repeat`,
                                minHeight: '400px'
                            }}></div>
                            
                            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                        <span style={{ 
                                            fontSize: '0.75rem', 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: '2rem', 
                                            background: getSeverityStyle(currentDetection.severity).bg, 
                                            color: getSeverityStyle(currentDetection.severity).color,
                                            border: `1px solid ${getSeverityStyle(currentDetection.severity).border}`
                                        }}>
                                            {currentDetection.severity} Severity
                                        </span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{currentDetection.plant}</span>
                                    </div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{currentDetection.disease || currentDetection.disease_name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ height: '4px', width: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                            <div style={{ height: '100%', width: `${currentDetection.confidence}%`, background: '#10b981', borderRadius: '2px' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }} className="agri-green">{Math.round(currentDetection.confidence)}% Confidence</span>
                                    </div>
                                </div>

                                <div className="agri-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', color: '#10b981' }}>
                                        <FlaskConical size={18} /> Chemical Solution
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                                        {currentDetection.treatment || currentDetection.solution}
                                    </p>
                                </div>

                                <div className="agri-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '1.2rem' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', color: '#10b981' }}>
                                        <Leaf size={18} /> Organic Solution
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                                        {currentDetection.organic_prevention || currentDetection.organic_solution}
                                    </p>
                                </div>

                                <p style={{ fontSize: '0.75rem', opacity: 0.4, fontStyle: 'italic' }}>
                                    {currentDetection.note}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PestDetectionPage;
