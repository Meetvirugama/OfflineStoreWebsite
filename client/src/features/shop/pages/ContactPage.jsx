import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { VITE_API_URL } from '@/core/api/client';

const ContactPage = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Contact Support - AgroMart";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('agromart_token');
            if (!token) {
                setStatus({ type: 'error', text: 'You must be logged in to send a support inquiry.' });
                return;
            }

            await axios.post(`${VITE_API_URL}/support/inquiry`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus({ type: 'success', text: 'Your message has been dispatched to our administration node.' });
            setFormData({ subject: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send inquiry.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page fade-in">
            <section className="policy-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Get in Touch</h1>
                    <p>Have questions about products, AI diagnostics, or mandi prices? Our support cell is ready.</p>
                </div>
            </section>

            <div className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
                    
                    {/* INFO SIDE */}
                    <div className="contact-info">
                        <h2 style={{ marginBottom: '32px' }}>Contact Information</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#059669' }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Call Node</h4>
                                    <p style={{ color: '#64748b' }}>+91 98765 00000</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#059669' }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Email Relay</h4>
                                    <p style={{ color: '#64748b' }}>support@agroplatform.app</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#059669' }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Physical Node</h4>
                                    <p style={{ color: '#64748b' }}>Sector 12, Agro-Tech Park, Ahmedabad, Gujarat</p>
                                </div>
                            </div>

                            <div className="card-premium" style={{ marginTop: '20px', padding: '24px', background: '#ecfdf5', borderColor: '#10b981' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', color: '#047857' }}>
                                    <MessageCircle size={24} />
                                    <h4 style={{ margin: 0 }}>Live Chat Available</h4>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#065f46' }}>
                                    Logged-in farmers can use the floating chat widget at the bottom right for instant support.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FORM SIDE */}
                    <div className="card-premium" style={{ padding: '40px' }}>
                        <h2>Send an Inquiry</h2>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>This will be delivered to our administrative dashboard and your registered email.</p>
                        
                        {status && (
                            <div style={{ 
                                padding: '16px', 
                                borderRadius: '8px', 
                                marginBottom: '24px',
                                background: status.type === 'error' ? '#fff1f2' : '#f0fdf4',
                                color: status.type === 'error' ? '#be123c' : '#166534',
                                border: `1px solid ${status.type === 'error' ? '#fda4af' : '#bbf7d0'}`
                            }}>
                                {status.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Subject</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Order Tracking or Pest Diagnostic Help"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Detailed Message</label>
                                <textarea 
                                    required
                                    rows="6"
                                    placeholder="How can we help your farm today?"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary" 
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', borderRadius: '12px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                            >
                                {loading ? 'Relaying...' : <><Send size={18} /> Dispatched Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
