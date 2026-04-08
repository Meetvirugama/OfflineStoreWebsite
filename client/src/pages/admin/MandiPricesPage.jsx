import { useEffect, useState } from "react";
import useMandiStore from "../../store/mandiStore";
import "../../styles/Admin.css";

const DISTRICTS = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", 
    "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", 
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", 
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", 
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
];

const COMMON_CROPS = [
    "Wheat", "Cotton", "Groundnut", "Castor Seed", "Cumin", "Mustard", "Guar Seed", 
    "Soyabean", "Onion", "Potato", "Tomato", "Brinjal", "Cauliflower"
];

export default function MandiPricesPage() {
    const { prices, loading, filters, setFilters, fetchPrices, totalCount, page, setPage } = useMandiStore();

    useEffect(() => {
        fetchPrices();
    }, [page, filters]);

    const handleFilterChange = (e) => {
        setFilters({ [e.target.name]: e.target.value });
    };

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div>
                    <h2>Mandi Intelligence Hub</h2>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Real-time commodity prices from verified Agmarknet sources.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-elite primary" onClick={fetchPrices}>Refresh Data</button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="admin-table-filters" style={{ 
                background: '#fff', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '24px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>Search Crop</label>
                    <select name="commodity" value={filters.commodity} onChange={handleFilterChange} className="modal-form-input" style={{ width: '100%', padding: '10px' }}>
                        <option value="">All Crops</option>
                        {COMMON_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>District</label>
                    <select name="district" value={filters.district} onChange={handleFilterChange} className="modal-form-input" style={{ width: '100%', padding: '10px' }}>
                        <option value="">All Districts</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>Date</label>
                    <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="modal-form-input" style={{ width: '100%', padding: '10px' }} />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Collecting market data...</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Market (Mandi)</th>
                                <th>District</th>
                                <th>Commodity</th>
                                <th>Min Price</th>
                                <th>Max Price</th>
                                <th>Modal Price</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>{p.market}</td>
                                    <td>{p.district}</td>
                                    <td>
                                        <span style={{ 
                                            background: '#f0fdf4', 
                                            color: '#166534', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>{p.commodity}</span>
                                    </td>
                                    <td>₹{p.min_price}</td>
                                    <td>₹{p.max_price}</td>
                                    <td style={{ fontWeight: '700', color: '#059669' }}>₹{p.modal_price}</td>
                                    <td>{new Date(p.arrival_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Showing {prices.length} of {totalCount} records</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                className="t-btn view" 
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >Previous</button>
                            <button 
                                className="t-btn view" 
                                disabled={prices.length < 20}
                                onClick={() => setPage(page + 1)}
                            >Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
