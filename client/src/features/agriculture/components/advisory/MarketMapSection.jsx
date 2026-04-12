import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) map.setView([lat, lon], 10);
    }, [lat, lon, map]);
    return null;
};

const MarketMapSection = ({ advisory, formData, loading }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2rem', marginTop: '1rem' }}>
            {/* Map Area */}
            <div className="agri-card" style={{ height: '450px', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', flex: '1 1 500px', minWidth: '300px' }}>
                <MapContainer center={[formData.lat || 22.3, formData.lon || 70.8]} zoom={10} style={{ height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap lat={formData.lat} lon={formData.lon} />
                    {advisory?.mandis_list?.map((m, idx) => (
                        <Marker key={idx} position={[m.lat, m.lng]}>
                            <Popup><div style={{fontWeight: 800}}>{m.name}</div> ₹{m.modal_price}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Price Details Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '1 1 350px' }}>
                <div className="agri-card" style={{ padding: '2rem', background: '#fff', border: '2px solid var(--agri-green)', borderRadius: '32px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)' }}>
                    <div style={{ padding: '0.4rem 0.8rem', background: 'var(--agri-green)', color: '#fff', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, display: 'inline-block', marginBottom: '1rem', letterSpacing: '1px' }}>BEST MARKET LOGIC</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{loading ? 'ANALYZING...' : advisory?.best_mandi?.name || 'Searching...'}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--agri-green)', margin: '1rem 0', letterSpacing: '-1px' }}>{loading ? '---' : advisory?.best_mandi?.modal_price ? `₹${advisory.best_mandi.modal_price}` : '---'}</div>
                    <div style={{ padding: '1.2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                        {loading ? 'Calculating proximity and price ceiling...' : (advisory?.accuracy_meta?.best_mandi_reason || 'Identified as the optimal node for trade based on current regional arrival patterns.')}
                    </div>
                </div>

                <div className="agri-card glass-card" style={{ padding: '1.8rem', borderRadius: '32px', flex: 1, maxHeight: '250px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, marginBottom: '1.5rem', letterSpacing: '1.2px' }}>REGIONAL APMC NETWORK (100KM)</h4>
                    {advisory?.mandis_list?.length > 0 ? advisory.mandis_list.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{m.name}</span>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 900, color: 'var(--agri-green)', fontSize: '1.1rem' }}>₹{m.modal_price}</div>
                                <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800 }}>{m.distance} KM</span>
                            </div>
                        </div>
                    )) : (
                        <div style={{padding: '2rem 0', textAlign: 'center', opacity: 0.3, fontWeight: 800, fontSize: '0.8rem'}}>NO LOCAL NODES IDENTIFIED</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketMapSection;
