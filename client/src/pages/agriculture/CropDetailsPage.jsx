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
            {recommendation && (
                <div className="recommendation-banner">
                    <div className="weather-icon"><Thermometer size={48} /></div>
                    <div>
                        <h3>Live Agri-Recommendation</h3>
                        <p>{recommendation.recommendation}</p>
                        <div className="stats-grid" style={{marginTop: '0.5rem'}}>
                            <span className="weather-badge">📍 {recommendation.weather.location}</span>
                            <span className="weather-badge">🌡️ {recommendation.weather.temperature}°C</span>
                            <span className="weather-badge">💧 {recommendation.weather.humidity}% Humidity</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="hero-section">
                <img 
                    src={selectedCrop.images[0] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'} 
                    alt={selectedCrop.name} 
                    className="crop-image" 
                />
                <div>
                    <h1 className="agri-title">{selectedCrop.name}</h1>
                    <p className="description">{selectedCrop.description}</p>
                    
                    <div className="stats-grid">
                        <div className="agri-card">
                            <Wheat className="agri-green" />
                            <h4>Growing Method</h4>
                            <p>{selectedCrop.growing.sowing_method}</p>
                        </div>
                        <div className="agri-card">
                            <MapPin className="agri-green" />
                            <h4>Spacing</h4>
                            <p>{selectedCrop.growing.row_spacing_cm} cm</p>
                        </div>
                        <div className="agri-card">
                            <Thermometer className="agri-green" />
                            <h4>Sunlight</h4>
                            <p>{selectedCrop.environment.sun}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                <div className="agri-card">
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                        <Droplets className="agri-green" />
                        <h3>Watering & Soil</h3>
                    </div>
                    <p><strong>Frequency:</strong> {selectedCrop.watering.frequency}</p>
                    <p><strong>Soil:</strong> {selectedCrop.environment.soil}</p>
                    <p style={{marginTop: '1rem', opacity: 0.8}}>{selectedCrop.watering.notes}</p>
                </div>

                <div className="agri-card">
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                        <Info className="agri-green" />
                        <h3>Harvesting</h3>
                    </div>
                    <p><strong>Time:</strong> {selectedCrop.harvesting.time}</p>
                    <p><strong>Method:</strong> {selectedCrop.harvesting.method}</p>
                </div>
            </div>

            <div className="agri-card" style={{marginTop: '2rem'}}>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <Lightbulb className="agri-accent" />
                    <h3>Pro Farmer Tips</h3>
                </div>
                <ul style={{paddingLeft: '1.5rem'}}>
                    {selectedCrop.tips.map((tip, idx) => (
                        <li key={idx} style={{marginBottom: '0.8rem', opacity: 0.9}}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CropDetailsPage;
