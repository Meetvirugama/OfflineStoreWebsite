import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';
import axios from 'axios';
import { VITE_API_URL } from '@/core/api/client';
import '@/styles/global.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" });
    };

    useEffect(() => {
        if (isOpen) {
            fetchChat();
            const interval = setInterval(fetchMessages, 3000); // Polling every 3s
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(scrollToBottom, [messages]);

    const fetchChat = async () => {
        try {
            const res = await axios.get(`${VITE_API_URL}/chat/my-chat`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChatId(res.data.data.id);
            setMessages(res.data.data.ChatMessages || []);
        } catch (err) {
            console.error(\"Chat initialization failed\", err);
        }
    };

    const fetchMessages = async () => {
        if (!chatId) return;
        try {
            const res = await axios.get(`${VITE_API_URL}/chat/messages/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.data);
        } catch (err) {
            console.error(\"Message sync failed\", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !chatId) return;

        const text = inputText;
        setInputText('');

        try {
            await axios.post(`${VITE_API_URL}/chat/message`, {
                chat_id: chatId,
                text: text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (err) {
            console.error(\"Message dispatch failed\", err);
        }
    };

    if (!token) return null; // Guest farmers don't get chat

    return (
        <div className=\"chat-widget-container\" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {/* TOGGLE BUTTON */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%', background: '#059669', color: '#fff',
                        border: 'none', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)', cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={30} />
                </button>
            )}

            {/* CHAT BOX */}
            {isOpen && (
                <div 
                    className=\"card-premium\" 
                    style={{
                        width: '350px', height: '500px', display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '16px', background: '#059669', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
                            <h4 style={{ margin: 0 }}>AgroSupport Live</h4>
                        </div>
                        <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Messages Body */}
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                            Connected to Support Node
                        </div>
                        
                        {messages.map((msg, i) => {
                            const isMe = msg.sender_id === user.id;
                            return (
                                <div key={i} style={{ 
                                    maxWidth: '80%', 
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    padding: '10px 14px',
                                    borderRadius: '16px',
                                    background: isMe ? '#059669' : '#fff',
                                    color: isMe ? '#fff' : '#1e293b',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.text}</p>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                        <input 
                            type=\"text\" 
                            placeholder=\"Type message...\"
                            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #e2e8f0', outline: 'none' }}
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                        />
                        <button 
                            type=\"submit\"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#059669', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
