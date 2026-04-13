import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Bellavista Group Of Nursing Homes</h3>
            <p>Providing exceptional care with a focus on comfort, dignity, and personalized attention in a beautiful, serene environment.</p>
            <div className="social-links">
              <a aria-label="Facebook" href="https://www.facebook.com/bellavistanursinghome/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a aria-label="Twitter" href="https://x.com/home_bellavista?lang=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a aria-label="YouTube" href="https://www.youtube.com/@bellavistagroupofnursinghomes" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/newsletters">Newsletters</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Homes</h4>
            <ul className="footer-links">
              <li><Link to="/bellavista-barry">Bellavista Barry</Link></li>
              <li><Link to="/bellavista-cardiff">Bellavista Cardiff</Link></li>
              <li><Link to="/waverley-care-center">Waverley Care Centre</Link></li>
              <li><Link to="/college-fields-nursing-home">College Fields</Link></li>
              <li><Link to="/baltimore-care-home">Baltimore Care Home</Link></li>
              <li><Link to="/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <ul className="footer-contact-links">
              <li>
                <Link to="/contact">
                  <i className="fas fa-envelope-open-text"></i>
                  <span>General Enquiries</span>
                </Link>
              </li>
              <li>
                <Link to="/our-homes">
                  <i className="fas fa-map-marked-alt"></i>
                  <span>Find a Home</span>
                </Link>
              </li>
              <li>
                <Link to="/career">
                  <i className="fas fa-user-nurse"></i>
                  <span>Careers</span>
                </Link>
              </li>
            </ul>

            <p className="footer-contact-note">Looking for a specific home's contact info? Select a home from the list.</p>

            <div className="footer-legal-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Use</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Bellavista Group Of Nursing Homes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;