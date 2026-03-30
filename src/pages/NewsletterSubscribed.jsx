import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import '../styles/MainPage.css';

const NewsletterSubscribed = () => {
  return (
    <>
      <SEO
        title="Subscribed | Bellavista Nursing Homes"
        description="Thank you for subscribing to the Bellavista Nursing Homes newsletter."
        url="/newsletter-subscribed"
      />
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '60px 50px', maxWidth: '520px', width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px'
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: '#16a34a' }}></i>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1652C9', marginBottom: '12px' }}>
            Thanks for Subscribing!
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '10px' }}>
            You're now subscribed to the <strong>Bellavista Nursing Homes</strong> newsletter.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
            A confirmation email has been sent to your inbox. You'll receive our monthly newsletter with the latest news, events, and stories from our homes.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/newsletters"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1652C9', color: 'white', padding: '12px 24px',
                borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px'
              }}
            >
              <i className="fas fa-newspaper"></i> Browse Newsletters
            </Link>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent', color: '#1B3C78', padding: '12px 24px',
                borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
                border: '1.5px solid #1B3C78'
              }}
            >
              <i className="fas fa-home"></i> Back to Home
            </Link>
          </div>

          <p style={{ marginTop: '28px', fontSize: '12px', color: '#94a3b8' }}>
            To unsubscribe at any time, click the unsubscribe link in any newsletter email.
          </p>
        </div>
      </div>
    </>
  );
};

export default NewsletterSubscribed;
