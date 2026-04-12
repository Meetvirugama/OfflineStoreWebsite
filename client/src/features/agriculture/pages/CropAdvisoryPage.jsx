import React, { useState, useEffect, useCallback } from 'react';
import useAdvisoryStore from '@features/agriculture/crop/advisory.store';
import useWeatherStore from '@features/agriculture/weather/weather.store';
import { Sprout, History, ChevronRight } from 'lucide-react';
import '@/styles/agriIntelligence.css';

// Sub-components
import AdvisoryHeader from '../components/advisory/AdvisoryHeader';
import TelemetryForm from '../components/advisory/TelemetryForm';
import StrategicAdvisoryCard from '../components/advisory/StrategicAdvisoryCard';
import MarketMapSection from '../components/advisory/MarketMapSection';
import RiskAssessmentList from '../components/advisory/RiskAssessmentList';
import ActivityPulse from '../components/advisory/ActivityPulse';

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Soybean", "Maize"];
const STAGES = ["Sowing", "Vegetative", "Flowering", "Fruiting", "Harvesting"];

const CropAdvisoryPage = () => {
    const { curAdvisory, history, loading, generateAdvisory, fetchHistory } = useAdvisoryStore();
    const { selectedLocation, initialize } = useWeatherStore();
    const [syncStatus, setSyncStatus] = useState('SYNCED');
    
    const [formData, setFormData] = useState({
        crop: "Wheat",
        stage: "Sowing",
        location: selectedLocation?.name || "",
        lat: selectedLocation?.lat || null,
        lon: selectedLocation?.lon || null
    });

    const init = useCallback(async () => {
        await initialize?.();
        await fetchHistory();
    }, [initialize, fetchHistory]);

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (selectedLocation) {
            setFormData(prev => ({
                ...prev,
                location: selectedLocation.name,
                lat: selectedLocation.lat,
                lon: selectedLocation.lon
            }));
            setSyncStatus('SYNCED');
        }
    }, [selectedLocation]);

    const handleLocationDetect = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setSyncStatus('DETECTING');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({ 
                    ...prev, 
                    lat: pos.coords.latitude, 
                    lon: pos.coords.longitude,
                    location: "Detected Location" 
                }));
                setSyncStatus('MANUAL');
            },
            (err) => {
                setSyncStatus('ERROR');
                alert("Unable to detect location. Please enter manually.");
            }
        );
    };

    const handleGenerate = async () => {
        if (!formData.location && (!formData.lat || !formData.lon)) {
            alert("Please provide a location");
            return;
        }
        await generateAdvisory(formData);
    };

    return (
        <div className="agri-page">
            <AdvisoryHeader syncStatus={syncStatus} />

            <div className="stats-grid" style={{ gridTemplateColumns: 'minmax(380px, 420px) 1fr', gap: '3rem' }}>
                
                {/* Side Parameters Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <TelemetryForm 
                        formData={formData} 
                        setFormData={setFormData}
                        syncStatus={syncStatus}
                        onDetect={handleLocationDetect}
                        onGenerate={handleGenerate}
                        loading={loading}
                        crops={CROPS}
                        stages={STAGES}
                    />

                    <RiskAssessmentList advisory={curAdvisory} />
                </div>

                {/* Main Content Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {!curAdvisory && !loading && (
                        <div className="agri-card" style={{ padding: '8rem 4rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '40px' }}>
                            <Sprout size={48} className="agri-green" style={{ margin: '0 auto 2.5rem' }} />
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 900 }}>Hub Standby</h3>
                            <p style={{ opacity: 0.5, fontSize: '1.1rem', fontWeight: 500 }}>Synchronize data to unlock AI-powered agronomy.</p>
                        </div>
                    )}

                    {(curAdvisory || loading) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <StrategicAdvisoryCard advisory={curAdvisory} loading={loading} />

                            <MarketMapSection advisory={curAdvisory} formData={formData} loading={loading} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <ActivityPulse advisory={curAdvisory} loading={loading} />

                                {/* Historical Context Pulsar */}
                                {history?.length > 0 && (
                                    <div className="agri-card" style={{ padding: '2.5rem', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '32px' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, letterSpacing: '1px', marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <History size={14} /> RECENT INTELLIGENCE PULSES
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                            {history.slice(0, 4).map((h, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => useAdvisoryStore.setState({ curAdvisory: h })}
                                                    style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center', 
                                                        padding: '1.2rem 1.5rem', 
                                                        background: curAdvisory?.id === h.id ? 'var(--agri-green)' : '#fff', 
                                                        color: curAdvisory?.id === h.id ? '#fff' : '#1e293b',
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                                                    }}
                                                >
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{h.crop}</div>
                                                        <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{h.location} • {h.stage}</div>
                                                    </div>
                                                    <ChevronRight size={16} style={{ opacity: 0.4 }} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropAdvisoryPage;
 
 export default CropAdvisoryPage;
