import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'bv_desktop_notice_dismissed';

const DesktopExperienceNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let mounted = true;
    const checkViewport = () => {
      if (!mounted) return;
      try {
        const dismissed = window.localStorage.getItem(STORAGE_KEY);
        const isMobileViewport = window.innerWidth <= 768;
        if (!dismissed && isMobileViewport) {
          setVisible(true);
        }
      } catch {
        const isMobileViewport = window.innerWidth <= 768;
        if (isMobileViewport) {
          setVisible(true);
        }
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => {
      mounted = false;
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '72px',
        left: 0,
        right: 0,
        zIndex: 10001,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 16px',
          background: 'rgba(15, 23, 42, 0.97)',
          color: '#f9fafb',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '999px',
            backgroundImage: 'linear-gradient(135deg, #1B3C78, #1FA4A9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <i className="fa-solid fa-desktop" aria-hidden="true" style={{ color: '#f9fafb' }}></i>
        </div>
        <div style={{ flex: 1, fontSize: '13px', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Best viewed on a larger screen</div>
          <div>
            You are currently browsing on a mobile device. The site works on mobile, but for the
            most detailed experience we recommend using a desktop or larger tablet in landscape.
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            marginLeft: '8px',
            alignSelf: 'center',
            background: 'transparent',
            border: 'none',
            color: '#e5e7eb',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '999px'
          }}
          aria-label="Dismiss desktop experience message"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default DesktopExperienceNotice;
