import React, { useState } from 'react';
import '../styles/Contact.css';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const locations = [
    {
      name: 'Bellavista Nursing Home Barry',
      address: '106-108 Tynewydd Road, Barry, CF62 8BB',
      phone: '01446 743983',
      email: 'manager@bellavistanursinghome.com',
      mapLink: 'https://maps.google.com/?q=106-108+Tynewydd+Road,+Barry,+CF62+8BB'
    },
    {
      name: 'Bellavista Nursing Home Cardiff',
      address: '2 Harrowby Place, Cardiff Bay, CF10 5GB',
      phone: '029 2048 5588',
      email: 'cardiff@bellavistanursinghome.com',
      mapLink: 'https://maps.google.com/?q=2+Harrowby+Place,+Cardiff+Bay,+CF10+5GB'
    },
    {
      name: 'Waverley Care Centre',
      address: '122-124 Plymouth Road, Penarth, CF64 5DN',
      phone: '029 2070 5282',
      email: 'reception@waverleycarecentre.com',
      mapLink: 'https://maps.google.com/?q=122-124+Plymouth+Road,+Penarth,+CF64+5DN'
    },
    {
      name: 'College Fields Nursing Home',
      address: 'College Fields Close, Barry, CF62 8LE',
      phone: '+44 1446 747778',
      email: 'reception@cfnh.wales',
      mapLink: 'https://maps.google.com/?q=College+Fields+Close,+Barry,+CF62+8LE'
    },
    {
      name: 'Baltimore Care Home',
      address: '1-2 Park Rd, Barry, CF62 6NU',
      phone: '01446 420714',
      email: 'manager@baltimorecarehome.com',
      mapLink: 'https://maps.google.com/?q=1-2+Park+Rd,+Barry,+CF62+6NU'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/care-enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          enquiryType: 'General Contact',
          location: 'General'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="contact-page">
      <SEO 
        title="Contact Bellavista Nursing Homes"
        description="Get in touch with Bellavista Nursing Homes in Barry, Cardiff, Penarth and the Vale of Glamorgan to discuss care options or arrange a visit."
        url="/contact"
      />
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any question you might have.</p>
        </div>
      </div>

      <section className="contact-content">
        <div className="container">
          <div className="locations-grid">
            {locations.map((loc, index) => (
              <div key={index} className="location-card">
                <h3>{loc.name}</h3>
                <div className="contact-detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{loc.address}</p>
                </div>
                <div className="contact-detail">
                  <i className="fas fa-phone"></i>
                  <p>{loc.phone}</p>
                </div>
                <div className="contact-detail">
                  <i className="fas fa-envelope"></i>
                  <p>{loc.email}</p>
                </div>
                <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="btn-map">
                  View on Map
                </a>
              </div>
            ))}
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {status.success && (
              <div className="alert success">
                Thank you for your message! We will get back to you shortly.
              </div>
            )}
            {status.error && (
              <div className="alert error">
                {status.error}. Please try again later.
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                  disabled={status.loading}
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email" 
                  required 
                  disabled={status.loading}
                />
              </div>
              <div className="form-group">
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  required
                  disabled={status.loading}
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message" 
                  rows="5" 
                  required
                  disabled={status.loading}
                ></textarea>
              </div>
              <button type="submit" className="btn-submit" disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
