import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import apiClient from '@/core/api/client';
import '@styles/ContactPage.css';

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
        setStatus(null);
        try {
            const token = localStorage.getItem('agromart_token');
            if (!token) {
                setStatus({ type: 'error', text: 'You must be logged in to send a support inquiry.' });
                return;
            }

            await apiClient.post('/support/inquiry', formData);

            setStatus({ type: 'success', text: 'Your message has been dispatched to our administration node.' });
            setFormData({ subject: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', text: err.message || 'Failed to send inquiry.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page fade-in">
            <section className="contact-hero">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>Have questions about products, AI diagnostics, or mandi prices? Our support cell is ready.</p>
                </div>
            </section>

            <div className="container">
                <div className="contact-grid">
                    
                    {/* INFO SIDE */}
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        
                        <div className="info-item">
                            <div className="info-icon">
                                <Phone size={24} />
                            </div>
                            <div className="info-text">
                                <h4>Call Node</h4>
                                <p>+91 98765 00000</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <Mail size={24} />
                            </div>
                            <div className="info-text">
                                <h4>Email Relay</h4>
                                <p>support@agroplatform.app</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <MapPin size={24} />
                            </div>
                            <div className="info-text">
                                <h4>Physical Node</h4>
                                <p>Sector 12, Agro-Tech Park, Ahmedabad, Gujarat</p>
                            </div>
                        </div>

                        <div className="live-chat-card">
                            <div className="live-chat-header">
                                <MessageCircle size={24} />
                                <span>Live Chat Available</span>
                            </div>
                            <p>
                                Logged-in farmers can use the floating chat widget at the bottom right for instant support.
                            </p>
                        </div>
                    </div>

                    {/* FORM SIDE */}
                    <div className="inquiry-form-card">
                        <h2>Send an Inquiry</h2>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>This will be delivered to our administrative dashboard and your registered email.</p>
                        
                        {status && (
                            <div className={`form-status form-status-${status.type}`}>
                                {status.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Subject</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    required
                                    placeholder="e.g. Order Tracking or Pest Diagnostic Help"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <label>Detailed Message</label>
                                <textarea 
                                    className="form-control"
                                    required
                                    rows="6"
                                    placeholder="How can we help your farm today?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-submit"
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
