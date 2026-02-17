import React, { useState } from 'react';
import '../styles/ScheduleTour.css';
import { saveEnquiryLocal, saveEnquiryToAPI } from '../services/enquiryService';
import SEO from '../components/SEO';
import { trackFormSubmission } from '../utils/analytics';

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'General',
    location: 'Barry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const enquiry = {
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      enquiryType: formData.enquiryType,
      location: formData.location,
      message: formData.message,
      createdAt: new Date().toISOString(),
      status: 'received'
    };
    
    try {
      saveEnquiryLocal(enquiry);
    } catch (err) {
      console.error("Local enquiry save error", err);
    }
    
    try {
      await saveEnquiryToAPI(enquiry);
    } catch (err) {
      console.error("API enquiry save error", err);
    }
    
    setLoading(false);
    setSubmitted(true);
    
    // Track successful enquiry form submission
    trackFormSubmission('Enquiry Form', {
      formId: 'enquiry-form',
      category: 'enquiry',
      enquiryType: formData.enquiryType,
      location: formData.location
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      enquiryType: 'General',
      location: 'Bellavista Barry',
      message: ''
    });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Make an Enquiry | Bellavista Nursing Homes",
    "description": "Send an enquiry to Bellavista Nursing Homes about care options, availability and our homes across South Wales.",
    "about": {
      "@type": "Organization",
      "name": "Bellavista Nursing Homes"
    }
  };

  if (submitted) {
    return (
      <>
        <SEO 
          title="Make an Enquiry | Bellavista Nursing Homes"
          description="Thank you for your enquiry to Bellavista Nursing Homes. Our team will respond shortly."
          url="/enquiry"
          schema={schema}
        />
      <div className="tour-page">
        <div className="tour-header">
          <div className="container">
            <h1>Make an Enquiry</h1>
          </div>
        </div>
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            background: 'white', 
            padding: '40px', 
            borderRadius: '15px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#e6f7ee', 
              color: '#00b85c', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '32px', 
              margin: '0 auto 20px' 
            }}>
              <i className="fas fa-check"></i>
            </div>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Enquiry Sent!</h2>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Thank you for reaching out. We have received your message and will get back to you shortly.
            </p>
            <button 
              className="submit-btn" 
              onClick={() => setSubmitted(false)}
              style={{ maxWidth: '200px' }}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Make an Enquiry | Bellavista Nursing Homes"
        description="Contact Bellavista Nursing Homes with questions about care, availability, funding or our homes."
        url="/enquiry"
        schema={schema}
      />
    <div className="tour-page">
      <div className="tour-header">
        <div className="container">
          <h1>Make an Enquiry</h1>
          <p>We are here to help answer your questions about care and our homes</p>
        </div>
      </div>

      <div className="container">
        <div className="tour-content-grid">
          <div className="tour-info">
            <h2>How can we help?</h2>
            <div className="info-card">
              <h3><i className="fas fa-question-circle"></i> Care Advice</h3>
              <p>Our experienced team can offer guidance on the types of care available and funding options.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-phone-alt"></i> Direct Contact</h3>
              <p>Prefer to speak to someone? Call our main office on <strong>01446 743983</strong>.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-envelope-open-text"></i> Quick Response</h3>
              <p>We aim to respond to all online enquiries within 24 hours.</p>
            </div>
          </div>

          <div className="tour-form-container">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="tour-form">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Enquiry Type</label>
                <select 
                  name="enquiryType" 
                  value={formData.enquiryType} 
                  onChange={handleChange}
                >
                  <option value="General">General Enquiry</option>
                  <option value="Care Availability">Care Availability</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Related Home (if applicable)</label>
                <select 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                >
                  <option value="Any">Any / Not Sure</option>
                  <option value="Bellavista Barry">Bellavista Barry</option>
                  <option value="Bellavista Cardiff">Bellavista Cardiff</option>
                  <option value="Waverley Care Centre">Waverley Care Centre</option>
                  <option value="College Fields Nursing Home">College Fields Nursing Home</option>
                  <option value="Baltimore Care Home">Baltimore Care Home</option>
                  <option value="Meadow Vale Cwtch">Meadow Vale Cwtch</option>
                  <option value="Bellavista Pontypridd">Bellavista Pontypridd</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Sending...</span>
                ) : (
                  "Send Enquiry"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Enquiry;
