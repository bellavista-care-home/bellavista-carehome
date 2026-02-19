import React, { useEffect } from 'react';

const SessionExpiredModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        overscrollBehavior: 'contain'
      }}>
        <div style={{ marginBottom: '20px', color: '#ff4757', fontSize: '48px' }}>
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Session Expired</h3>
        <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
          Your session has timed out due to inactivity. Please log in again to continue.
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#1B3C78',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
