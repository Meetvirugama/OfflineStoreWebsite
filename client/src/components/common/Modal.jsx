import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, amount, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 20, 15, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style>
                {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes modalEnter { from { transform: scale(0.95) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                `}
            </style>
            
            <div style={{
                background: '#064e3b',
                padding: '45px 40px',
                borderRadius: '32px',
                maxWidth: '480px',
                width: '95%',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                animation: 'modalEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* 🌿 Top Accent Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #10b981, #d9f99d, #10b981)' }} />

                <div style={{ 
                    width: '85px', 
                    height: '85px', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '30px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 20px auto',
                    boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '40px'
                }}>
                    🏛️
                </div>

                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>{title}</h2>
                
                {amount && (
                    <div style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '100px',
                        color: '#10b981',
                        fontSize: '24px',
                        fontWeight: '900',
                        margin: '15px 0 25px 0',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)'
                    }}>
                        ₹{amount}
                    </div>
                )}

                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', margin: '0 0 35px 0', fontWeight: '500' }}>{message}</p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={onClose}
                        style={{ 
                            flex: 1, 
                            padding: '16px', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.15)', 
                            background: 'rgba(255,255,255,0.05)', 
                            color: '#FFFFFF', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            fontSize: '15px',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        style={{ 
                            flex: 1, 
                            padding: '16px', 
                            borderRadius: '16px', 
                            border: 'none', 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                            color: 'white', 
                            fontWeight: '800', 
                            cursor: 'pointer',
                            fontSize: '15px',
                            boxShadow: '0 12px 24px -6px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 15px 30px -8px rgba(16, 185, 129, 0.6)'; }}
                        onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 12px 24px -6px rgba(16, 185, 129, 0.4)'; }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
