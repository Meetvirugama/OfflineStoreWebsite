import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, amount, confirmText = "Confirm", cancelText = "Cancel", children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 20, 15, 0.75)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
        }}>
            <style>
                {`
                    @keyframes eliteSpringUp {
                        from { transform: scale(0.9) translateY(40px); opacity: 0; }
                        to { transform: scale(1) translateY(0); opacity: 1; }
                    }
                    .elite-modal-shell {
                        animation: eliteSpringUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                `}
            </style>
            
            <div className="elite-modal-shell" style={{
                background: 'linear-gradient(165deg, #064e3b 0%, #022c22 100%)',
                padding: '40px',
                borderRadius: '35px',
                maxWidth: '520px',
                width: '100%',
                boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                {/* 🌿 Pulse Accent */}
                <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    width: '150px', 
                    height: '150px', 
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>{title}</h2>
                    
                    {amount && (
                        <div style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '100px',
                            color: '#10b981',
                            fontSize: '22px',
                            fontWeight: '900',
                            margin: '10px 0 20px 0'
                        }}>
                            ₹{amount}
                        </div>
                    )}

                    {message && (
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', margin: '0 0 30px 0', fontWeight: '500' }}>
                            {message}
                        </p>
                    )}

                    {/* RENDER FORM / CHILDREN */}
                    {children && (
                        <div style={{ marginBottom: '30px' }}>
                            {children}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            onClick={onClose}
                            style={{ 
                                flex: 1, 
                                padding: '16px', 
                                borderRadius: '18px', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                background: 'transparent', 
                                color: 'rgba(255,255,255,0.6)', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            style={{ 
                                flex: 1, 
                                padding: '16px', 
                                borderRadius: '18px', 
                                border: 'none', 
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                color: 'white', 
                                fontWeight: '800', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.5)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 25px -5px rgba(5, 150, 105, 0.6)'; }}
                            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px -5px rgba(5, 150, 105, 0.5)'; }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
