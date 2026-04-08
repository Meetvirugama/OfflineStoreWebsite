import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCropStore } from '../../store/cropStore';
import { MapPin, Thermometer, Droplets, Wheat, Info, Lightbulb } from 'lucide-react';
import '../../styles/agriIntelligence.css';

const CropDetailsPage = () => {
    const { name } = useParams();
    const { selectedCrop, recommendation, loading, fetchCropInfo, fetchRecommendation } = useCropStore();

    useEffect(() => {
        if (name) {
            fetchCropInfo(name);
            fetchRecommendation(name);
        }
    }, [name, fetchCropInfo, fetchRecommendation]);

    if (loading) return <div className="agri-page">Loading intelligence...</div>;
    if (!selectedCrop) return <div className="agri-page">Crop not found or data fetching failed.</div>;

    return (
        <div className="agri-page">
            <div style={{
                position: 'fixed', top: 0, right: 0, width: '40%', height: '100%', 
                background: `linear-gradient(to left, rgba(16, 185, 129, 0.05), transparent)`, 
                pointerEvents: 'none', zIndex: 0 
            }} />

            {recommendation && (
                <div className="agri-card" style={{
                    marginBottom: '4rem', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.4))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    gap: '3rem',
                    alignItems: 'center',
                    padding: '2.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Thermometer size={40} className="agri-green" />
                    </div>
                    <div>
                        <div className="weather-badge" style={{marginBottom: '0.8rem'}}>Live Climate Telemetry</div>
                        <h2 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>{recommendation.recommendation}</h2>
                        <div style={{display: 'flex', gap: '2rem', opacity: 0.7}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={16} /> Regional Hub</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Thermometer size={16} /> {recommendation.weather.temperature}°C</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Droplets size={16} /> {recommendation.weather.humidity}% Ambient Humidity</span>
                        </div>
                    </div>
                </div>
            )}

            <div style={{display: 'flex', gap: '5rem', position: 'relative', zIndex: 1, marginBottom: '5rem'}}>
                <div style={{flex: '0 0 500px'}}>
                    <div style={{position: 'sticky', top: '3rem'}}>
                        <div style={{position: 'relative'}}>
                            <div style={{
                                position: 'absolute', top: '-20px', left: '-20px', 
                                width: '100%', height: '100%', background: 'var(--agri-green)', 
                                borderRadius: '2.5rem', opacity: 0.1, zIndex: -1
                            }} />
                            <img 
                                src={selectedCrop.images[0] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'} 
                                alt={selectedCrop.name} 
                                style={{
                                    width: '100%', height: '600px', objectFit: 'cover', 
                                    borderRadius: '2.5rem', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        </div>
                        <div style={{marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                            <div className="agri-card" style={{padding: '1.5rem', textAlign: 'center'}}>
                                <h4 style={{opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>BOTANICAL CLASS</h4>
                                <div style={{fontWeight: 900, fontSize: '1.2rem'}}>{selectedCrop.name}</div>
                            </div>
                            <div className="agri-card" style={{padding: '1.5rem', textAlign: 'center'}}>
                                <h4 style={{opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>TAXONOMY ID</h4>
                                <div style={{fontWeight: 900, fontSize: '1.2rem'}}>AGRI-{selectedCrop.name.slice(0,3).toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{flex: 1}}>
                    <h1 className="agri-title" style={{fontSize: '5rem', marginBottom: '2rem'}}>{selectedCrop.name}</h1>
                    <p style={{fontSize: '1.4rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '4rem', fontWeight: 500}}>
                        {selectedCrop.description}
                    </p>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '3rem'}}>
                        <div className="agri-card" style={{padding: '3rem'}}>
                            <h3 style={{fontSize: '1.8rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <Wheat className="agri-green" /> Cultivation Geometry
                            </h3>
                            <div className="stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                                <div>
                                    <h4 style={{opacity: 0.5, marginBottom: '0.5rem'}}>SOWING METHOD</h4>
                                    <p style={{fontSize: '1.2rem', fontWeight: 700}}>{selectedCrop.growing.sowing_method}</p>
                                </div>
                                <div>
                                    <h4 style={{opacity: 0.5, marginBottom: '0.5rem'}}>ROW SPACING</h4>
                                    <p style={{fontSize: '1.2rem', fontWeight: 700}}>{selectedCrop.growing.row_spacing_cm} Centimeters</p>
                                </div>
                                <div>
                                    <h4 style={{opacity: 0.5, marginBottom: '0.5rem'}}>PHOTOPERIOD</h4>
                                    <p style={{fontSize: '1.2rem', fontWeight: 700}}>{selectedCrop.environment.sun}</p>
                                </div>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="agri-card" style={{padding: '2.5rem'}}>
                                <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                    <Droplets size={24} className="agri-green" /> Resource Management
                                </h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    <p><strong>Irrigation Phase:</strong> {selectedCrop.watering.frequency}</p>
                                    <p><strong>Soil Architecture:</strong> {selectedCrop.environment.soil}</p>
                                    <p style={{marginTop: '1rem', opacity: 0.6, fontSize: '0.9rem'}}>{selectedCrop.watering.notes}</p>
                                </div>
                            </div>

                            <div className="agri-card" style={{padding: '2.5rem'}}>
                                <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                    <Info size={24} className="agri-green" /> Harvest Telemetry
                                </h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    <p><strong>Harvest Window:</strong> {selectedCrop.harvesting.time}</p>
                                    <p><strong>Extraction Method:</strong> {selectedCrop.harvesting.method}</p>
                                </div>
                            </div>
                        </div>

                        <div className="agri-card" style={{padding: '3rem', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
                            <h3 style={{fontSize: '1.8rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <Lightbulb className="agri-accent" /> Institutional Best Practices
                            </h3>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                                {selectedCrop.tips.map((tip, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', gap: '1rem', padding: '1.5rem', 
                                        background: 'rgba(255,255,255,0.02)', borderRadius: '1.2rem',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{color: 'var(--agri-accent)', fontWeight: 900}}>0{idx + 1}</div>
                                        <div style={{fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6}}>{tip}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropDetailsPage;
