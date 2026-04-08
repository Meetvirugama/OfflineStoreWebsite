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
                    marginBottom: '2rem', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.4))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    padding: '1.2rem 2rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Thermometer size={24} className="agri-green" />
                    </div>
                    <div>
                        <h2 style={{fontSize: '1.2rem', marginBottom: '0.2rem'}}>{recommendation.recommendation}</h2>
                        <div style={{display: 'flex', gap: '1.5rem', opacity: 0.6, fontSize: '0.85rem'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><MapPin size={14} /> Regional Hub</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Thermometer size={14} /> {recommendation.weather.temperature}°C</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Droplets size={14} /> {recommendation.weather.humidity}% Humidity</span>
                        </div>
                    </div>
                </div>
            )}

            <div style={{display: 'flex', gap: '3rem', position: 'relative', zIndex: 1}}>
                <div style={{flex: '0 0 320px'}}>
                    <div style={{position: 'sticky', top: '1.5rem'}}>
                        <div style={{position: 'relative'}}>
                            <img 
                                src={selectedCrop.images[0] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'} 
                                alt={selectedCrop.name} 
                                style={{
                                    width: '100%', height: '400px', objectFit: 'cover', 
                                    borderRadius: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        </div>
                        <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                            <div className="agri-card" style={{padding: '1rem', textAlign: 'center'}}>
                                <h4 style={{opacity: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem'}}>CLASS</h4>
                                <div style={{fontWeight: 800, fontSize: '0.9rem'}}>{selectedCrop.name}</div>
                            </div>
                            <div className="agri-card" style={{padding: '1rem', textAlign: 'center'}}>
                                <h4 style={{opacity: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem'}}>INDEX</h4>
                                <div style={{fontWeight: 800, fontSize: '0.9rem'}}>AGRI-{selectedCrop.name.slice(0,3).toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{flex: 1}}>
                    <h1 className="agri-title" style={{fontSize: '2.8rem', marginBottom: '1.2rem'}}>{selectedCrop.name}</h1>
                    <p style={{fontSize: '1rem', lineHeight: 1.6, opacity: 0.7, marginBottom: '2.5rem'}}>
                        {selectedCrop.description}
                    </p>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div className="agri-card" style={{padding: '1.5rem'}}>
                            <h3 style={{fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                                <Wheat className="agri-green" size={20} /> Cultivation Geometry
                            </h3>
                            <div className="stats-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
                                <div>
                                    <h4 style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.3rem'}}>SOWING</h4>
                                    <p style={{fontSize: '1rem', fontWeight: 700}}>{selectedCrop.growing.sowing_method}</p>
                                </div>
                                <div>
                                    <h4 style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.3rem'}}>ROW SPACING</h4>
                                    <p style={{fontSize: '1rem', fontWeight: 700}}>{selectedCrop.growing.row_spacing_cm} cm</p>
                                </div>
                                <div>
                                    <h4 style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.3rem'}}>SUNLIGHT</h4>
                                    <p style={{fontSize: '1rem', fontWeight: 700}}>{selectedCrop.environment.sun}</p>
                                </div>
                            </div>
                        </div>

                        <div className="stats-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                            <div className="agri-card" style={{padding: '1.5rem'}}>
                                <h3 style={{fontSize: '1.1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                                    <Droplets size={18} className="agri-green" /> Resource
                                </h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem'}}>
                                    <p><strong style={{opacity: 0.5}}>IRRIGATION:</strong> {selectedCrop.watering.frequency}</p>
                                    <p><strong style={{opacity: 0.5}}>SOIL:</strong> {selectedCrop.environment.soil}</p>
                                    <p style={{marginTop: '0.5rem', opacity: 0.5, fontSize: '0.8rem', fontStyle: 'italic'}}>{selectedCrop.watering.notes}</p>
                                </div>
                            </div>

                            <div className="agri-card" style={{padding: '1.5rem'}}>
                                <h3 style={{fontSize: '1.1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                                    <Info size={18} className="agri-green" /> Harvesting
                                </h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem'}}>
                                    <p><strong style={{opacity: 0.5}}>WINDOW:</strong> {selectedCrop.harvesting.time}</p>
                                    <p><strong style={{opacity: 0.5}}>METHOD:</strong> {selectedCrop.harvesting.method}</p>
                                </div>
                            </div>
                        </div>

                        <div className="agri-card" style={{padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.1)'}}>
                            <h3 style={{fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                                <Lightbulb className="agri-accent" size={20} /> Institutional Tips
                            </h3>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                                {selectedCrop.tips.map((tip, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', gap: '0.8rem', padding: '1rem', 
                                        background: 'rgba(255,255,255,0.01)', borderRadius: '0.8rem',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }}>
                                        <div style={{color: 'var(--agri-accent)', fontWeight: 800, fontSize: '0.8rem'}}>0{idx + 1}</div>
                                        <div style={{fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.5}}>{tip}</div>
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
