import { useState, useEffect, useRef } from "react";
import { Search, Send, User, MessageSquare, Shield, Clock, CheckCircle2 } from "lucide-react";
import useAuthStore from "@features/auth/store/auth.store";
import axios from "axios";

export default function AdminChatPage() {
    const { token } = useAuthStore();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (token) {
            fetchChats();
            const interval = setInterval(fetchChats, 5000);
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        if (selectedChat && token) {
            fetchMessages(selectedChat.id);
            const interval = setInterval(() => fetchMessages(selectedChat.id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedChat, token]);

    const fetchChats = async () => {
        try {
            const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
            const res = await api.get("/chat/admin/all", { headers: { Authorization: `Bearer ${token}` } });
            setChats(res.data.data);
        } catch (err) {
            console.error("Global chat fetch failed", err);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
            const res = await api.get(`/chat/admin/messages/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(res.data.data);
        } catch (err) {
            console.error("Admin message sync failed", err);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedChat) return;

        try {
            const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
            await api.post("/chat/admin/reply", { chatId: selectedChat.id, text: reply }, { headers: { Authorization: `Bearer ${token}` } });
            setReply("");
            fetchMessages(selectedChat.id);
        } catch (err) {
            console.error("Admin reply failed", err);
        }
    };

    const filteredChats = chats.filter(c => 
        c.User?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-chat-page" style={{ padding: '30px', height: 'calc(100vh - 100px)', display: 'flex', gap: '30px' }}>
            {/* Sidebar: Conversations */}
            <div className="card-premium" style={{ width: '350px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '15px', color: '#1e293b' }}>Support Inbox</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                        <input 
                            type="text" 
                            placeholder="Search Farmer..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 15px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredChats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setSelectedChat(chat)}
                            style={{ 
                                padding: '15px 20px', 
                                cursor: 'pointer',
                                background: selectedChat?.id === chat.id ? '#f0fdf4' : 'transparent',
                                borderLeft: selectedChat?.id === chat.id ? '4px solid #059669' : '4px solid transparent',
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{chat.User.name}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {chat.ChatMessages?.[0]?.text || "New conversation..."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Chat View */}
            <div className="card-premium" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {selectedChat ? (
                    <>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 700 }}>
                                    {selectedChat.User.name[0]}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedChat.User.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle2 size={12} /> Active Farmer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc' }}>
                            {messages.map(m => {
                                const isAdmin = m.Sender?.role === "ADMIN" || m.senderId !== selectedChat.userId;
                                return (
                                    <div key={m.id} style={{ 
                                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                    }}>
                                        <div style={{ 
                                            padding: '12px 18px',
                                            borderRadius: isAdmin ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                            background: isAdmin ? '#1e293b' : '#fff',
                                            color: isAdmin ? '#fff' : '#1e293b',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                            fontSize: '0.95rem'
                                        }}>
                                            {m.text}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '4px', display: 'block', textAlign: isAdmin ? 'right' : 'left' }}>
                                            {isAdmin ? "Support Admin" : selectedChat.User.name} • {new Date(m.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleReply} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '15px' }}>
                            <input 
                                type="text" 
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Reply to farmer..." 
                                style={{ flex: 1, padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                            />
                            <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={18} /> Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                        <MessageSquare size={80} strokeWidth={1} style={{ marginBottom: '20px' }} />
                        <h3>Select a conversation to start helping</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
