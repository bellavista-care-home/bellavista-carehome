import React, { useState } from 'react';

const STORAGE_KEY = 'bv_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  });

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    }
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        color: '#f9fafb',
        padding: '16px 24px',
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div style={{ flex: '1 1 260px', fontSize: '14px', lineHeight: 1.6 }}>
        We use cookies and similar technologies to improve your experience, to understand how our
        website is used, and to support essential security and login features. By clicking
        Accept, you agree to this use. You can withdraw consent at any time.
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <a
          href="/privacy-policy"
          style={{
            fontSize: '13px',
            color: '#e5e7eb',
            textDecoration: 'underline'
          }}
        >
          Privacy Policy
        </a>
        <button
          type="button"
          onClick={handleClose}
          style={{
            fontSize: '13px',
            padding: '8px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(148, 163, 184, 0.7)',
            backgroundColor: 'transparent',
            color: '#e5e7eb',
            cursor: 'pointer'
          }}
        >
          Manage later
        </button>
        <button
          type="button"
          onClick={handleAccept}
          style={{
            fontSize: '13px',
            padding: '8px 18px',
            borderRadius: '999px',
            border: 'none',
            backgroundImage: 'linear-gradient(135deg, #1B3C78, #1FA4A9)',
            color: '#f9fafb',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
