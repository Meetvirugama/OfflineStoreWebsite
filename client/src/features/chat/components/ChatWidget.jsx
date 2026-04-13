import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, ChevronDown, User, ShieldCheck } from "lucide-react";
import { VITE_API_URL } from "@core/api/client";
import useAuthStore from "@features/auth/store/auth.store";
import axios from "axios";

export default function ChatWidget() {
    const { user, token } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && token) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, token]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${VITE_API_URL}/chat/messages`, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(res.data.data);
        } catch (err) {
            console.error("Chat sync failed", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        try {
            await axios.post(`${VITE_API_URL}/chat/message`, { text: input }, { headers: { Authorization: `Bearer ${token}` } });
            setInput("");
            fetchMessages();
        } catch (err) {
            console.error("Message dispatch failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role === "ADMIN") return null;

    return (
        <div className="chat-widget-container" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="btn-primary"
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)'
                    }}
                >
                    <MessageSquare size={28} />
                </button>
            ) : (
                <div 
                    className="card-premium" 
                    style={{ 
                        width: '350px', 
                        height: '500px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        background: '#fff',
                        padding: 0,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <div style={{ 
                        padding: '20px', 
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Support Agent</h4>
                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online • Typically replies in minutes</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <ChevronDown size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
                                <MessageSquare size={40} style={{ margin: '0 auto 12px' }} />
                                <p style={{ fontSize: '0.9rem' }}>How can we help you today?</p>
                            </div>
                        ) : (
                            messages.map((m) => (
                                <div 
                                    key={m.id} 
                                    style={{ 
                                        alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        padding: '10px 14px',
                                        borderRadius: m.senderId === user.id ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                        background: m.senderId === user.id ? '#059669' : '#fff',
                                        color: m.senderId === user.id ? '#fff' : '#1e293b',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {m.text}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type message..."
                            style={{ 
                                flex: 1, 
                                border: '1px solid #e2e8f0', 
                                padding: '10px 15px', 
                                borderRadius: '10px',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button 
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px' }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
