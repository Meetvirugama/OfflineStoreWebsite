import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { VITE_API_URL } from '@/core/api/client';

const AdminChatPage = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
            const interval = setInterval(() => fetchMessages(selectedChat.id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" });
    }, [messages]);

    const fetchChats = async () => {
        try {
            const res = await axios.get(`${VITE_API_URL}/chat/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChats(res.data.data);
        } catch (err) {
            console.error(\"Global chat fetch failed\", err);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const res = await axios.get(`${VITE_API_URL}/chat/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.data);
        } catch (err) {
            console.error(\"Admin message sync failed\", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedChat) return;

        const text = inputText;
        setInputText('');

        try {
            await axios.post(`${VITE_API_URL}/chat/message`, {
                chat_id: selectedChat.id,
                text: text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages(selectedChat.id);
        } catch (err) {
            console.error(\"Admin reply failed\", err);
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '20px', padding: '20px' }}>
            {/* Sidebar: Chat List */}
            <div className=\"card-premium\" style={{ width: '350px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Support Inbox</h2>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
                        <input 
                            type=\"text\" 
                            placeholder=\"Search Farmer...\" 
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setSelectedChat(chat)}
                            style={{ 
                                padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                                background: selectedChat?.id === chat.id ? '#f0fdf4' : 'transparent',
                                borderLeft: selectedChat?.id === chat.id ? '4px solid #059669' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{chat.User.name}</h4>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Session #{chat.id}</span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {chat.ChatMessages?.[0]?.text || \"New conversation...\"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className=\"card-premium\" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {selectedChat ? (
                    <>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{selectedChat.User.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{selectedChat.User.email}</p>
                            </div>
                            <span style={{ padding: '4px 12px', borderRadius: '12px', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>ACTIVE SESSION</span>
                        </div>
                        
                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((msg, i) => {
                                const isAdmin = msg.sender?.role === 'ADMIN';
                                return (
                                    <div key={i} style={{ 
                                        maxWidth: '70%', 
                                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isAdmin ? 'flex-end' : 'flex-start'
                                    }}>
                                        <div style={{ 
                                            padding: '12px 16px', borderRadius: '12px',
                                            background: isAdmin ? '#059669' : '#fff',
                                            color: isAdmin ? '#fff' : '#1e293b',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            border: isAdmin ? 'none' : '1px solid #e2e8f0'
                                        }}>
                                            <p style={{ margin: 0 }}>{msg.text}</p>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                                            {isAdmin ? \"Support Admin\" : selectedChat.User.name}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
                            <input 
                                type=\"text\" 
                                placeholder=\"Reply to farmer...\" 
                                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                            />
                            <button className=\"btn-primary\" style={{ padding: '0 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={18} /> Reply
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
                        <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                            <MessageCircle size={40} />
                        </div>
                        <h3>Select a farmer to start chatting</h3>
                        <p>Real-time support sessions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPage;
