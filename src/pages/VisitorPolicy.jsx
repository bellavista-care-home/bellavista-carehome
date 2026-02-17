import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import SEO from '../components/SEO';

const VisitorPolicy = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Visitor Policy | Bellavista Nursing Homes",
    "description": "Visitor policy and guidelines for seeing loved ones at Bellavista Nursing Homes.",
    "about": {
      "@type": "Organization",
      "name": "Bellavista Nursing Homes"
    }
  };

  return (
    <>
      <SEO 
        title="Visitor Policy | Bellavista Nursing Homes"
        description="Read Bellavista Nursing Homes' visitor policy, including appointment system, visiting hours and safety guidance."
        url="/visitor-policy"
        schema={schema}
      />
    <div className="visitor-policy-page">
      <div className="page-header">
        <div className="container">
          <h1>Visitor Policy</h1>
          <p>Guidelines for visiting your loved ones</p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 0' }}>
        
        {/* Intro Section */}
        <div className="intro-section">
          <div className="intro-text-card">
             <h2>Visiting Information</h2>
             <p>
               At Bellavista Nursing Homes, we welcome visitors while prioritising the safety, wellbeing, and comfort of our residents and staff. Our homes follow strict infection control policies, and we ask all visitors to support these measures to help maintain a safe environment for everyone.
             </p>
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="section-header">
          <span className="badge">SAFETY FIRST</span>
          <h2>Visiting Guidelines</h2>
        </div>

        <div className="guidelines-grid">
          
          {/* Card 1: Appointment */}
          <div className="guideline-card">
            <div className="guideline-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Appointment System</h3>
            <p>Visits are currently by appointment to ensure the normal running of the home and residents' routines.</p>
          </div>

          {/* Card 2: Hours */}
          <div className="guideline-card">
            <div className="guideline-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Visiting Hours</h3>
            <p>Visits generally take place between <strong>10:00 am and 3:00 pm</strong> to accommodate daily care routines.</p>
          </div>

          {/* Card 3: Visitors */}
          <div className="guideline-card">
            <div className="guideline-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>Number of Visitors</h3>
            <p>Due to room sizes and ventilation, we may limit the number of visitors at one time (typically two).</p>
          </div>

          {/* Card 4: Health & Safety */}
          <div className="guideline-card">
            <div className="guideline-icon">
              <i className="fas fa-shield-virus"></i>
            </div>
            <h3>Health & Safety</h3>
            <p>Visitors may be asked to complete a health declaration or undergo testing depending on current guidelines. Masks may be required.</p>
          </div>

          {/* Card 5: Video Calls */}
          <div className="guideline-card">
            <div className="guideline-icon">
              <i className="fas fa-video"></i>
            </div>
            <h3>Video Calls</h3>
            <p>Video contacts are available via FaceTime, WhatsApp, or Zoom. Please contact the home to book a video link-up.</p>
          </div>

        </div>

        {/* Booking Section */}
        <div className="booking-section">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <i className="fas fa-calendar-alt"></i>
            <h2>How to Book a Visit</h2>
            <p>
              Please contact the specific home directly to book your appointment. 
              <br/>
              <strong>For College Fields</strong>, please telephone extension 200.
              <br/>
              <strong>For other homes</strong>, please use the main contact numbers provided on their respective pages.
            </p>
            
            <div className="booking-actions">
              <Link to="/contact" className="btn-primary">
                <i className="fas fa-phone-alt" style={{ marginRight: '10px' }}></i> Contact Us to Book
              </Link>
              <Link to="/our-homes" className="btn-outline">
                Find Home Number
              </Link>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              * If you are unable to attend your appointment, please let us know as soon as possible so the slot can be offered to another family.
            </p>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default VisitorPolicy;
