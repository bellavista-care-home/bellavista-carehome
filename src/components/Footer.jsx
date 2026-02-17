import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Bellavista Group Of Nursing Homes</h3>
            <p>Providing exceptional care with a focus on comfort, dignity, and personalized attention in a beautiful, serene environment.</p>
            <div className="social-links">
              <a aria-label="Facebook" href="https://www.facebook.com/bellavistanursinghome/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a aria-label="Twitter" href="https://x.com/home_bellavista?lang=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a aria-label="YouTube" href="https://www.youtube.com/@bellavistagroupofnursinghomes" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Our Homes</h3>
            <ul className="footer-links">
              <li><Link to="/bellavista-barry">Bellavista Barry</Link></li>
              <li><Link to="/bellavista-cardiff">Bellavista Cardiff</Link></li>
              <li><Link to="/waverley-care-center">Waverley Care Centre</Link></li>
              <li><Link to="/college-fields-nursing-home">College Fields</Link></li>
              <li><Link to="/baltimore-care-home">Baltimore Care Home</Link></li>
              <li><Link to="/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="footer-links">
              <li><Link to="/contact"><i className="fas fa-envelope-open-text"></i> General Enquiries</Link></li>
              <li><Link to="/contact"><i className="fas fa-map-marked-alt"></i> Find a Home</Link></li>
              <li><Link to="/career"><i className="fas fa-user-nurse"></i> Careers</Link></li>
            </ul>
            <div style={{marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
               <p style={{fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.6)'}}>
                 Looking for a specific home's contact info? Select a home from the list.
               </p>
               <p style={{fontSize: '12px', marginTop: '8px', color: 'rgba(255,255,255,0.6)'}}>
                 <Link to="/privacy-policy" style={{color: 'rgba(255,255,255,0.8)'}}>Privacy Policy</Link> ·{' '}
                 <Link to="/terms-of-service" style={{color: 'rgba(255,255,255,0.8)'}}>Terms of Use</Link>
               </p>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© 2026 Bellavista Group Of Nursing Homes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;